import type { InferSelectModel } from "drizzle-orm";
import {
  boolean,
  foreignKey,
  json,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import type { AppUsage } from "../usage";

export const user = pgTable("User", {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    firstName: varchar("firstName", { length: 64 }).notNull(),
    lastName: varchar("lastName", { length: 64 }).notNull(),
    password: varchar("password", { length: 64 }),
});

export type User = InferSelectModel<typeof user>;

export const document = pgTable("Document", {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
    title: text("title").notNull(),
    userId: uuid("userId")
      .notNull()
      .references(() => user.id),
    lastContext: jsonb("lastContext").$type<AppUsage | null>(),
    reportType: varchar("reportType", { length: 64 }).notNull(),
  });
  
  export type Document = InferSelectModel<typeof document>;