"use server"

import { db } from "@/db"
import { fileTable } from "@/db/schema"
import { ai } from "../ai"
import { storage } from "../storage"
import { desc, eq } from "drizzle-orm"

export async function summarizeFile(file: File, autheduserId: string) {
    
    const url = await storage.uploadFile(file)
    if(!url) throw new Error("Couldn't generate an url for the file")

    const summary =  await ai.summarizeFile(url)
    if(!summary) throw new Error("Couldn't generate a summary for the file")
        

    const [row] = await db.insert(fileTable).values({
        name: file.name,
        summary,
        uploadedById: autheduserId,
        url,
    }).returning()
    return row.id
}

export async function getSummary(fileId: string) {
    const [file] = await db.select().from(fileTable).where(eq(fileTable.id, fileId));
    if (!file) throw new Error("File not found");
    return file;
  }

  
export async function getUserSummaries(autheduserId: string) {
    const files = await db.select().from(fileTable).where(eq(fileTable.uploadedById, autheduserId)).orderBy(desc(fileTable.createdAt))
    if (!files || files.length === 0) throw new Error("Files not found");
    return files;
  }

    export async function getFourLatestUserSummaries(autheduserId: string) {
      const files = await db
        .select()
        .from(fileTable)
        .where(eq(fileTable.uploadedById, autheduserId))
        .orderBy(desc(fileTable.createdAt)) 
        .limit(4);
      return files;
    }