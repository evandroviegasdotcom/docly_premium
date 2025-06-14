import { InferSelectModel } from "drizzle-orm";
import { uuid, date, varchar, text, pgTable } from "drizzle-orm/pg-core";

export const fileTable = pgTable("Files", {
  id: uuid("id").defaultRandom().primaryKey(), 
  createdAt: date("createdAt").defaultNow(),
  url: varchar("url", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  uploadedById: varchar("uploadedById", { length: 255 }).notNull(),
  summary: text("summary").notNull(),
});

export type File = InferSelectModel<typeof fileTable>;