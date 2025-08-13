"use client";

import { Button } from "@/components/ui/button";
import { CircleSlash, File } from "lucide-react";
import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { file } from "@/services/file";
import { auth } from "@/services/auth";
import { useRouter } from "next/navigation";
import { Simonetta } from "next/font/google";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { User } from "@/services/auth/server";
import { subscription } from "@/services/subscription";

const simonetta = Simonetta({ subsets: ["latin"], weight: "400" });

export default function QuickUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [auhtedUser, setAuthedUser] = useState<null | User>(null);
  const [pendingFile, setPendingFile] = useState<null | File>(null);

  const [summarySize, setSummarySize] = useState<"small" | "medium" | "large">(
    "medium"
  );

  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const preUploadCheck = async (fileToUpload: File) => {
    // check if user has reached the uploading limit (if he has the free plan)
    const user = await auth.getAuthedUser();
    if (!user) return;
    setAuthedUser(user);

    const reachedLimit = await subscription.hasReachedUploadLimit(user.id);
    if (reachedLimit) return toast("You reached your upload limit!");

    const isPro = await subscription.isUserPro(user.id);
    if (isPro) {
      // check if user is pro -> modal
      setPendingFile(fileToUpload);
      setShowModal(true);
    } else {
      // check if user is not pro -> upload the file right away
      setSummarySize("medium");
      await handleUpload(fileToUpload, "medium");
    }
  };

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

    await preUploadCheck(fileToUpload);
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
    await preUploadCheck(fileToUpload);
  };

  const handleUpload = async (
    fileToUpload: File,
    size: "small" | "medium" | "large"
  ) => {
    if (isLoading) return;
    setIsLoading(true);

    const authedUser = await auth.getAuthedUser();
    if (!authedUser) {
      setIsLoading(false);
      return;
    }

    try {
      const fileId = await file.summarizeFile(
        fileToUpload,
        authedUser.id,
        size
      );
      router.push(`/home/summary/${fileId}`);
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmAndUpload = async () => {
    if (!pendingFile || !auhtedUser) return;
    await handleUpload(pendingFile, summarySize);
    setShowModal(false);
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
          {isLoading ? (
            <CircleSlash className="animate-spin" />
          ) : (
            <File
              className={cn(
                "transition-transform",
                isDragging && "text-primary scale-125"
              )}
            />
          )}

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

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Summary Size</DialogTitle>
          </DialogHeader>

          <RadioGroup
            value={summarySize}
            onValueChange={(v) => setSummarySize(v as any)}
          >
            <div className="flex items-center sapce-x-2">
              <RadioGroupItem value="small" id="small" />
              <Label htmlFor="small">Small</Label>
            </div>

            <div className="flex items-center sapce-x-2">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium">Medium</Label>
            </div>

            <div className="flex items-center sapce-x-2">
              <RadioGroupItem value="large" id="large" />
              <Label htmlFor="large">Large</Label>
            </div>
          </RadioGroup>

          <DialogFooter>
            <Button onClick={() => setShowModal(false)} variant="ghost">
              Cancel
            </Button>

            <Button onClick={confirmAndUpload} disabled={isLoading}>
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
