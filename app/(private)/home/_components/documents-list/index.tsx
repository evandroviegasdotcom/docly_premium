'use client'
import { Button } from "@/components/ui/button";
import { File } from "@/db/schema";
import { Bookmark } from "lucide-react";
import { Simonetta } from "next/font/google";
import Link from "next/link";
import React from "react";
import DocumentCard from "./document-card";
import useSWR from "swr";
import { auth } from "@/services/auth";
import { subscription } from "@/services/subscription";
const simonetta = Simonetta({ subsets: ["latin"], weight: "400" });

export default function DocumentsList({ summaries, isFavorites }: { summaries: File[], isFavorites?: boolean }) {
  const { data: user } = useSWR('/api/authed', () => auth.getAuthedUser())
  const { data: isPro, isLoading } = useSWR('/api/is-pro', () => subscription.isUserPro(user?.id))
  if(isLoading )return "Loading..."
  if(!user) return 
  return (
    <div className="py-8  space-y-6">
      <h1 className={`text-3xl font-bold  ${simonetta.className}`}>
        {isFavorites ? "Favorited Documents" : "My Documents"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {summaries.length === 0 ? (
          "No documents to show" 
        ) : (
          summaries.map((doc) => (
            <DocumentCard doc={doc} key={doc.id} authedUserId={user.id} isPro={!!isPro} />
          ))
        )}
      </div>
    </div>
  );
}
