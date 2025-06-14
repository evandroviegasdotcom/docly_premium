import React from "react";
import DocumentsList from "./_components/documents-list";
import { file } from "@/services/file";
import { auth } from "@/services/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function HomePage() {
  const authedUser = await auth.getAuthedUser();
  if (!authedUser) return null;
  const summaries = await file.getFourLatestUserSummaries(authedUser.id);
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 text-4xl">
      <Avatar className="h-20 w-20 rounded-lg">
                  <AvatarImage src={authedUser.imageUrl} alt={authedUser.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
          <div className="flex items-center gap-2">
    <span>👋 Hi, </span>
    <span className="font-semibold">{authedUser.name}</span>
          </div>
      </div>
      <hr />
      <DocumentsList summaries={summaries} />
    </div>
  );
}
