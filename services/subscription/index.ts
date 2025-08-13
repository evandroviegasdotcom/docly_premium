import { changeSubscriptionPlan, createBillingPortal, createSubscriptionCheckoutSession, hasReachedUploadLimit, isUserPro } from "./server";

const subscription = { createBillingPortal, createSubscriptionCheckoutSession, changeSubscriptionPlan, isUserPro, hasReachedUploadLimit }

export { subscription }