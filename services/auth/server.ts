"use server"

import { currentUser } from "@clerk/nextjs/server";
import { toast } from "sonner";

export async function getAuthedUser() {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;
    return {
        imageUrl: clerkUser.imageUrl,
        name: clerkUser.fullName || "",
        email: clerkUser.emailAddresses[0].emailAddress,
        id: clerkUser.id,
    }
}


