"use server"

import { db } from "@/db"
import { favoritesTable, fileTable } from "@/db/schema"
import { and, eq } from "drizzle-orm"

export async function addFavorite(fileId: string, userId: string) {
    return db.insert(favoritesTable).values({
        fileId,
        userId
    })
}

export async function removeFavorite(fileId: string, userId: string) {
    return db.delete(favoritesTable).where(
        and(
            eq(favoritesTable.fileId, fileId),
            eq(favoritesTable.userId, userId)
        )
    )
}

export async function isFavorited(fileId: string, userId: string) {
    const result = await db.select().from(favoritesTable).where(and(
        eq(favoritesTable.fileId, fileId),
        eq(favoritesTable.userId, userId),
    ))
        .limit(1)

    return result.length > 0
}

export async function getUserFavoriteFiles(userId: string) {
    const results = await db.select({
        file: fileTable
    }).from(favoritesTable)
        .innerJoin(fileTable, eq(favoritesTable.fileId, fileTable.id))
        .where(eq(favoritesTable.userId, userId))
        
    return results.map(row => row.file)
}