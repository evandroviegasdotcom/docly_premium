import { stripe } from "@/lib/stripe";
import { subscription } from "@/services/subscription";


export async function POST(req: Request) {
    const event = await req.json()

    let subscriptionId;
    let customerId = event?.data?.object?.customer

    switch (event.type) {
        case "invoice.payment_succeeded":
        case "invoice.paid":
            subscriptionId = event.data.object.subscription
            if (!subscriptionId) {
                const invoice = await stripe.invoices.retrieve(event.data.object.id)
                subscriptionId = invoice.subscription
            }
            break;
        case "payment_intent.succeeded":
            const invoiceId = event.data.object.invoice
            if (invoiceId) {
                const invoice = await stripe.invoices.retrieve(invoiceId)
                subscriptionId = invoice.subscription
                customerId = invoice.customer
            }
            break;
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
            subscriptionId = event.data.object.id;
            break;
        case "subscription_schedule.canceled":
            subscriptionId = event.data.object.subscription;
            break;
        case "checkout.session.completed":
            subscriptionId = event.data.object.subscription;
            customerId = event.data.object.customer;
            break;
        default:
            console.log(`💯 Unhandled event type: ${event.type}`);
            return new Response("Webhook received", { status: 200 });
    }


    if (subscriptionId && customerId) {
        await subscription.changeSubscriptionPlan(customerId, subscriptionId)
    } else {
        console.log("Missing subscriptionId or customerId", { subscriptionId, customerId })
    }

    return new Response("Webhook received", { status: 200 })
}