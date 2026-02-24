import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";


const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY!,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: NextRequest) {
    try {
        const { question, summary } = await req.json()

        const completion = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "system",
                    content: "You are an expert assistant answering questions based on the given doccument summary, your responses should be short and about the document"
                },
                {
                  role: "user",
                  content: `Here is the summary:\n\n${summary}\n\nQuestion: ${question}`  
                }
            ],
            max_tokens: 300,
            temperature: 0.5
        })


        const answer = completion.choices[0].message.content
        return NextResponse.json({ answer })
    } catch (err: any) {
        console.error(err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}