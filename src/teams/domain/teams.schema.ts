import { relations } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import {createId} from "@paralleldrive/cuid2";
import { MemberSchema } from "../../members/domain/member.schema";
import { varchar, timestamp } from "drizzle-orm/pg-core";

export const TeamSchema = pgTable("team",{
    id :varchar("id", {length: 255}).$default(() => createId()).primaryKey(),
    name: varchar("name", {length: 255}).notNull(),
    description: varchar("description", {length: 500}),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$default(() => new Date())
})

export const TeamRelations = relations(TeamSchema, ({ many }) => ({
    members: many(MemberSchema)
}));