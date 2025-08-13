import { InferSelectModel, relations } from "drizzle-orm";
import { uuid, date, varchar, text, pgTable } from "drizzle-orm/pg-core";

export const fileTable = pgTable("Files", {
  id: uuid("id").defaultRandom().primaryKey(), 
  createdAt: date("createdAt").defaultNow(),
  url: varchar("url", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  uploadedById: varchar("uploadedById", { length: 255 }).notNull(),
  summary: text("summary").notNull(),
});

export const customersTable = pgTable("customers", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull()
})

export const subscriptionsTable = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: text("customerId").unique().notNull(),
  plan: text("plan").notNull().default("free")
}) 

export const favoritesTable = pgTable("favorites", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("userId", { length: 255 }).notNull(),
  fileId: uuid("fileId").notNull()
})


// Relations

export const favoriteToFileRelation = relations(favoritesTable, ({ one }) => ({
  file: one(fileTable, {
    fields: [favoritesTable.fileId],
    references: [fileTable.id]
  })
}))

export const fileToFavoriteRelation = relations(fileTable, ({ many }) => ({
  favorite: many(fileTable)
}))



export const customerToSubscriptionRelation = relations(customersTable, ({ many }) => ({
  subscriptions: many(subscriptionsTable)
}))

export const subscriptionToCustomerRelation = relations(subscriptionsTable, ({ one }) => ({
  customer: one(customersTable, {
    fields: [subscriptionsTable.customerId],
    references: [customersTable.id]
  })
}))

export type File = InferSelectModel<typeof fileTable>;