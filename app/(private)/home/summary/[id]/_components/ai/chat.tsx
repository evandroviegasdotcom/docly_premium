"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";

type Message = [
    text: string,
    id: number,
    date: Date,
    author: "ai" | "user"
]
export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
    return (
    <div className="h-full w-full">
      <div className="h-full "></div>
      <div className="flex items-center gap-1">
        <Input placeholder="Ask something to the AI about the document" />
        <Button>Ask</Button>
      </div>
    </div>
  );
}
