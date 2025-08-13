'use client'

import { Button } from "@/components/ui/button";
import { File } from "@/db/schema";
import { favorite } from "@/services/favorite";
import { Bookmark } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";
import useSWR from "swr";

export default function DocumentCard({
  doc,
  isPro,
  authedUserId,
}: {
  authedUserId: string;
  doc: File;
  isPro: boolean;
}) {
  const { data: isFavorited, isLoading, mutate: refreshFavorite } = useSWR(
    `/api/is-favorited/${doc.id}`,
    () => favorite.isFavorited(doc.id, authedUserId)
  );

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
        if(isFavorited) {
            //remove from the favorites list
            await favorite.removeFavorite(doc.id, authedUserId)
            toast.success("Removed from favorites.")
        } else {
            // add to the favorites list
            await favorite.addFavorite(doc.id, authedUserId)
            toast.success("Added to the favorites")
        }
        refreshFavorite()
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    <Link
      key={doc.id}
      href={`/home/summary/${doc.id}`}
      rel="noopener noreferrer"
      className="relative rounded border border-gray-200 shadow-sm p-6 hover:shadow-md transition bg-white"
    >
      {isPro && (
        <Button
          disabled={isLoading}
          onClick={toggleFavorite}
          className="absolute right-2 top-2"
          variant="outline"
        >
          <Bookmark fill={isFavorited ? "Black" : "none"} />
        </Button>
      )}
      <div className="mb-2 text-sm text-gray-500">
        Uploaded:{" "}
        {doc.createdAt
          ? new Date(doc.createdAt).toLocaleDateString()
          : "Unknown"}
      </div>
      <h2 className="text-lg font-semibold mb-2 truncate ">{doc.name}</h2>
      <p className="text-sm text-gray-700 line-clamp-4">{doc.summary}</p>
    </Link>
  );
}
