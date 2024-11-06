// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration
import { InferSelectModel, sql } from "drizzle-orm";
import { boolean, pgTableCreator, uuid, timestamp, varchar } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `contacts_${name}`);

export const contacts = createTable("contact", {
  id: uuid().primaryKey().defaultRandom(),
  firstName: varchar("first_name", { length: 256 }).notNull(),
  lastName: varchar("last_name", { length: 256 }).notNull(),
  email: varchar({ length: 256 }).notNull(),
  avatarUrl: varchar("avatar_url", { length: 1024 }),
  userId: varchar("user_id", { length: 256 }).notNull(),
  favorite: boolean().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(() => new Date()),
});

export type Contact = InferSelectModel<typeof contacts>;
