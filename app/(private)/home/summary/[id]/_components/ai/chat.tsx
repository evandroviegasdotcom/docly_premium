"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth } from "@/services/auth";
import { subscription } from "@/services/subscription";
import React, { useState } from "react";
import useSWR from "swr";

type Message = { text: string; id: number; author: "ai" | "user" };
export default function Chat({ summary }: { summary: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data: user } = useSWR('/api/is-pro', () => auth.getAuthedUser())
  const { data: isPro } = useSWR('/api/is-pro', () => subscription.isUserPro(user?.id))

  const sendMessage =  async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      text: input,
      id: Math.random(),
      author: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setIsLoading(true);

    const res = await fetch("/api/ai/ask-question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: input, summary })
    })

    const data = await res.json()
    const aiMessage: Message = {
      text: data.answer,
      author: "ai",
      id: Math.random()
    }

    setMessages((prev) => [...prev, aiMessage]);

    setIsLoading(false);
  };

  if(!isPro) return "This feature is only avalible for the pro plan"

  return (
    <div className="h-full w-full flex flex-col max-h-[600px]">
      <div className="flex-grow p-4 overflow-auto space-y-2 ">
        {messages.map(message => (
          <div key={message.id} className={`p-2 rounded ${message.author === "ai" ? "bg-gray-100" : "bg-blue-100"}`}>
            <p className="text-sm text-gray-600">{message.author}</p>
            <p>{message.text}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 p-2 border-t">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something to the AI about the document"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button disabled={isLoading} onClick={sendMessage}>
          Ask
        </Button>
      </div>
    </div>
  );
}
