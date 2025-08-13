import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
    try {
        const { question, summary } = await req.json()

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are an expert assistant answering questions based on the given doccument summary"
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