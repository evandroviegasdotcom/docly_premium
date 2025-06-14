import { File } from "@/db/schema";
import { Cpu, Sparkles } from "lucide-react";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Chat from "./chat";

export default function Summary({ fileData }: { fileData: File }) {
  return (
    <div
      className="
      bg-gradient-to-r from-indigo-50 to-purple-50
      border-2 border-indigo-400 rounded-lg p-6 pt-12
      text-lg font-semibold leading-6 flex-grow overflow-auto
      relative
      shadow-[0_0_20px_rgba(99,102,241,0.9)]
      before:absolute before:inset-0 before:rounded-lg before:pointer-events-none
      before:bg-gradient-to-r before:from-indigo-300/30 before:via-purple-300/50 before:to-indigo-300/30
      flex flex-col
    "
    >
      {/* AI badge */}
      <div className="absolute top-3 right-3 flex items-center space-x-1 bg-indigo-100/80 backdrop-blur-sm px-2 py-0.5 rounded-full text-indigo-700 text-xs font-semibold uppercase tracking-wide shadow-md">
        <Cpu className="w-4 h-4" />
        <span>AI Generated</span>
      </div>

      <Tabs defaultValue="summary" className="h-full">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>
        <TabsContent value="summary">
          <div>{fileData.summary}</div>
        </TabsContent>
        <TabsContent value="chat" className="h-full">
    <Chat />
        </TabsContent>
      </Tabs>

      {/* Decorative icon at bottom */}
      <div className="self-end opacity-30 animate-pulse">
        <Sparkles className="w-6 h-6 text-purple-400" />
      </div>
    </div>
  );
}
