import { ProjectSchema } from '@/projects/domain/project.schema';
import { relations } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import {createId} from "@paralleldrive/cuid2";
import { varchar, timestamp } from "drizzle-orm/pg-core";
import { User2TeamsSchema } from "@/database/schemas/user-teams.schema";

export const TeamSchema = pgTable("team",{
    id :varchar("id", {length: 255}).$default(() => createId()).primaryKey(),
    name: varchar("name", {length: 255}).notNull(),
    description: varchar("description", {length: 500}).default(""),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$default(() => new Date())
})

export const TeamRelations = relations(TeamSchema, ({ many }) => ({
    members: many(User2TeamsSchema),
    projects: many(ProjectSchema)
}));