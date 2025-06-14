"use client";

import { Button } from "@/components/ui/button";
import { File } from "lucide-react";
import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { file } from "@/services/file";
import { auth } from "@/services/auth";
import { useRouter } from "next/navigation";
import { Simonetta } from "next/font/google";

const simonetta = Simonetta({ subsets: ['latin'], weight: '400' });

export default function QuickUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    if (isLoading) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;

    if (files.length > 1) {
      return toast("Upload one file at a time!");
    }

    const fileToUpload = files[0];
    if (fileToUpload.name.split(".").at(-1) !== "pdf") {
      return toast("File must be a PDF");
    }

    if (fileToUpload.size > 1024 * 1024) {
      return toast("File must be smaller than 1MB");
    }

    await handleUpload(fileToUpload);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileToUpload = e.target.files?.[0];
    if (!fileToUpload) return;

    if (fileToUpload.name.split(".").at(-1) !== "pdf") {
      return toast("File must be a PDF");
    }

    if (fileToUpload.size > 1024 * 1024) {
      return toast("File must be smaller than 1MB");
    }
    await handleUpload(fileToUpload);
  };

  const handleUpload = async (fileToUpload: File) => {
    if (isLoading) return;
    setIsLoading(true);

    const authedUser = await auth.getAuthedUser();
    if (!authedUser) {
      setIsLoading(false);
      return;
    }

    try {
      const fileId = await file.summarizeFile(fileToUpload, authedUser.id);
      router.push(`/home/summary/${fileId}`);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className={`text-3xl font-bold ${simonetta.className}`}>
        Quick Upload
      </h1>

      <div
        className={cn(
          "relative w-full h-[400px] border-2 border-dashed rounded transition-colors duration-300",
          isDragging ? "border-primary animate-pulse" : "",
          isLoading ? "opacity-50 pointer-events-none" : ""
        )}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="absolute inset-0 flex flex-col gap-2 justify-center items-center pointer-events-none">
          <File
            className={cn(
              "transition-transform",
              isDragging && "text-primary scale-125"
            )}
          />
          <span className="font-semibold text-2xl">
            {isDragging ? "Drop it now!" : "Drop a file"}
          </span>
          <Button
            disabled={isLoading}
            onClick={() => fileInputRef.current?.click()}
            className="pointer-events-auto"
          >
            Or Select a file
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
}
