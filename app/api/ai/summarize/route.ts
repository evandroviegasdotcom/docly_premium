import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    // Step 1: Convert PDF to text using PDF.co
    const res = await fetch("https://api.pdf.co/v1/pdf/convert/to/text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.PDFCO_API_KEY!,
      },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();

    if (data.error || !data.url) {
      throw new Error("PDF.co conversion failed");
    }

    const textRes = await fetch(data.url);
    const text = await textRes.text();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes documents concisely.",
        },
        {
          role: "user",
          content: `Summarize the following document text in 2-3 sentences:\n\n${text}`,
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const summary = completion.choices[0].message.content;
    console.log(summary)

    return NextResponse.json({ summary }, { status: 200 });
  } catch (error: any) {
    console.error("❌ Error in summarizing PDF:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}