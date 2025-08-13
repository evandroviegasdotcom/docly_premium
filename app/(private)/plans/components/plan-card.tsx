"use client"

import { Button } from "@/components/ui/button";
import { Forward } from "lucide-react";
import React from "react";

type Feature = {
  icon: React.ReactNode;
  label: React.ReactNode;
};

export default function PlanCard({
  title,
  price,
  onUpgradeClick,
  features,
}: {
  title: string;
  price: number;
  onUpgradeClick: () => void;
  features: Feature[];
}) {
  return (
    <div className="flex flex-col gap-8 border border-primary/20 p-9 rounded">
      <div className="flex flex-col gap-1.5">
        <span className="text-4xl font-semibold uppercase">{title}</span>
        <span className="text-muted-foreground">${price}/month</span>
      {price !== 0 && (
        <Button className="flex items-center gap-12" onClick={onUpgradeClick}>
            <span>Upgrade Now</span>
            <span><Forward /></span>
        </Button>
      )}
      </div>

      <div className="flex flex-col gap-3 text-lg">
      {features.map(feature => (
        <div key={feature.label?.toString()} className="text-muted-foreground flex items-center gap-1.5">
            <span>{feature.icon}</span>
            <span className="text-sm">{feature.label}</span>
        </div>
      ))}
      </div>


    </div>
  );
}
