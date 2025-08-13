"use server"

import { db } from "@/db"
import { customersTable, fileTable, subscriptionsTable } from "@/db/schema"
import { stripe } from "@/lib/stripe"
import { clerkClient } from "@clerk/nextjs/server"
import { count, eq } from "drizzle-orm"


export async function changeSubscriptionPlan(customerId: string, subscriptionId: string) {
    let plan = "free"
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    const isCancelling = subscription.cancellation_details?.reason === "cancellation_requested"

    if (isCancelling) {
        plan = "free"
    } else {
        plan = "pro"
    }

    const existing = await db.query.subscriptionsTable.findFirst({
        where: (subs, { eq }) => eq(subs.customerId, customerId)
    })

    if (existing) {
        await db
            .update(subscriptionsTable)
            .set({ plan })
            .where(eq(subscriptionsTable.customerId, customerId))
        return { ...existing, plan }
    }

    return await db.insert(subscriptionsTable).values({ customerId, plan }).returning()
}

export async function hasReachedUploadLimit(userId: string) {
    const isPro = await isUserPro(userId)
    if (isPro) return false

    const [data] = await db.select({ count: count() }).from(fileTable).where(eq(fileTable.uploadedById, userId))
    const userUploadCount = data.count

    if(!isPro && userUploadCount >= 5) return true
}

export async function createBillingPortal(userId: string) {
    const customerId = await getCustomerId(userId)
    if(!customerId) throw new Error("Couldn't find customer")

    const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/home`
    })

    return session.url
}

export async function isUserPro(userId: string): Promise<boolean> {
    const customerId = await getCustomerId(userId)
    if (!customerId) return false

    const subscriptions = await db.query.subscriptionsTable.findMany({
        where: (s, { eq }) => eq(s.customerId, customerId)
    })

    return subscriptions.some(s => s.plan === "pro")
}

export async function getCustomerId(userId: string): Promise<string | null> {
    const existingCustomer = await db.query.customersTable.findFirst({
        where: (c, { eq }) => eq(c.userId, userId)
    })
    if (existingCustomer?.id) {
        return existingCustomer.id
    }

    const clerk = await clerkClient()
    const clerkUser = await clerk.users.getUser(userId)
    const email = clerkUser.emailAddresses[0].emailAddress

    const newCustomer = await stripe.customers.create({
        email,
        metadata: { userId }
    })

    await db.insert(customersTable).values({
        id: newCustomer.id,
        userId
    })

    return newCustomer.id

}

export async function createSubscriptionCheckoutSession({
    userId,
    priceId
}: {
    userId: string
    priceId: string
}) {
    const customerId = await getCustomerId(userId)
    if (!customerId) throw new Error("Couldn't find customer")

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        customer: customerId,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/home`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/plans`
    })

    return session.url
}