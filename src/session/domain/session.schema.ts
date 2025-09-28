import { pgTable, varchar, timestamp, integer, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { UserSchema } from "@/database/index.schema";
import { relations } from "drizzle-orm";

export const SessionTypeEnum = pgEnum("session_type", ["email_verification", "password_reset", "two_factor", "login_verification"]);

export const SessionSchema = pgTable('sessions', {
    id: varchar('id', { length: 255 }).primaryKey().notNull().$default(() => createId()),
    email: varchar('email', { length: 255 }).notNull().references(() => UserSchema.email, { onDelete: 'cascade' }),
    token: varchar('token', { length: 6 }).notNull(),
    type: SessionTypeEnum('type').notNull(),
    createdAt: timestamp('created_at').$default(() => new Date()).notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    attempts: integer('attempts').$default(() => 0).notNull(),
    maxAttempts: integer('max_attempts').$default(() => 3).notNull(),
    used: boolean('used').$default(() => false).notNull(),
    data: varchar('data', { length: 1000 })
})

export const sessionRelations = relations(SessionSchema, ({one}) => ({
    user: one(UserSchema, { fields: [SessionSchema.email], references: [UserSchema.email] })
}))
