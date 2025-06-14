import { Button } from "@/components/ui/button";
import { File } from "@/db/schema";
import { Bookmark } from "lucide-react";
import { Simonetta } from "next/font/google";
import Link from "next/link";
import React from "react";
const simonetta = Simonetta({ subsets: ["latin"], weight: "400" });

export default function DocumentsList({ summaries }: { summaries: File[] }) {
  return (
    <div className="py-8  space-y-6">
      <h1 className={`text-3xl font-bold  ${simonetta.className}`}>
        My Documents
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {summaries.map((doc) => (
          <Link
            key={doc.id}
            href={`/home/summary/${doc.id}`}
            rel="noopener noreferrer"
            className="relative rounded border border-gray-200 shadow-sm p-6 hover:shadow-md transition bg-white"
          >
                <Button className="absolute right-2 top-2" variant="outline">
              <Bookmark />
            </Button>
            <div className="mb-2 text-sm text-gray-500">
              Uploaded:{" "}
              {doc.createdAt
                ? new Date(doc.createdAt).toLocaleDateString()
                : "Unknown"}
            </div>
            <h2 className="text-lg font-semibold mb-2 truncate ">{doc.name}</h2>
            <p className="text-sm text-gray-700 line-clamp-4">{doc.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
