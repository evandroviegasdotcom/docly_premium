import { utapi } from "@/uploadthing";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const formData = await req.formData();
    const file = formData.get("file") as File
    try {
        const response = await utapi.uploadFiles(file)
        return NextResponse.json(response)
    } catch (error) {
        return NextResponse.json({ error: "Error uploading file" }, { status: 500 })
    }
}