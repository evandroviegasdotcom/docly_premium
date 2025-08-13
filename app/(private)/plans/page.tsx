"use client";

import Image from "next/image";
import React from "react";
import PlanCard from "./components/plan-card";
import { plans } from "./data";
import { auth } from "@/services/auth";
import { subscription } from "@/services/subscription";
import { toast } from "sonner";

export default function PlansPage() {
  const onPlanClick = async ({
    plan,
    priceId,
  }: {
    plan: "free" | "pro";
    priceId: string | null;
  }) => {
    const authedUser = await auth.getAuthedUser();
    if (!authedUser) return;

    const isUserPro = await subscription.isUserPro(authedUser.id)
    if(isUserPro && plan === "pro") {
      return toast("You already have this plan")
    }
    
    if (plan === "pro") {
      const url = await subscription.createSubscriptionCheckoutSession({
        userId: authedUser.id,
        priceId: priceId as string,
      });

      if (!url) return toast("Something went wrong");
      location.replace(url);
    }
  };
  return (
    <div className="grid grid-cols-2 h-screen">
      <div className="relative">
        <Image
          src="/images/plans.png"
          fill
          className="object-cover grayscale"
          alt="Image"
        />
      </div>
      <div className="grid grid-cols-2 gap-8 p-12 my-auto">
        <PlanCard
          title={plans.free.title}
          price={plans.free.price}
          features={plans.free.features}
          onUpgradeClick={() => onPlanClick({ plan: "free", priceId: null })}
        />
        <PlanCard
          title={plans.pro.title}
          price={plans.pro.price}
          features={plans.pro.features}
          onUpgradeClick={() =>
            onPlanClick({
              plan: "pro",
              priceId: "price_1Rsi4qFJk0YGoUtmkMLLuMPG",
            })
          }
        />
      </div>
    </div>
  );
}
