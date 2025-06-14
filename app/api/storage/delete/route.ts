import { utapi } from "@/uploadthing";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const formData = await req.formData();
    const key = formData.get("fileKey") as string
    try {
        const response = await utapi.deleteFiles(key)
        return NextResponse.json({ ok: true }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: "Error deleting file" }, { status: 500 })
    }
}