import { FileText, Upload, TextCursorInput, Infinity, Save, MessageSquare } from "lucide-react";

export const plans = {
  free: {
    title: "Free",
    price: 0,
    features: [
      { label: "Summarize documents", icon: <FileText /> },
      { label: "Can upload 5 PDF files", icon: <Upload /> },
    ]
  },
  pro: {
    title: "Pro",
    price: 7.99,
    features: [
      { label: "Define summary length", icon: <TextCursorInput /> },
      { label: "Unlimited uploads", icon: <Infinity /> },
      { label: "Save summaries", icon: <Save /> },
      { label: "Ask questions to the AI", icon: <MessageSquare /> },
    ]
  }
};
