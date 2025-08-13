import Stripe from "stripe"
const sKey = process.env.STRIPE_SECRET_KEY || ""

export const stripe = new Stripe(sKey)