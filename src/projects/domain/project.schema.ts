import { pgTable } from "drizzle-orm/pg-core"
import { varchar, timestamp } from "drizzle-orm/pg-core"
import {createId} from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { TeamSchema } from "@/database/index.schema";

export const Projectschema = pgTable("projects",{
    id :varchar("id", {length: 255}).$default(() => createId()).primaryKey(),
    team: varchar('team_id', {length: 255}).notNull().references(() => TeamSchema.id),
    name: varchar("name", {length: 255}).notNull(),
    description: varchar("description", {length: 500}),
    tasks: varchar("tasks", {length: 255}),
    columns: varchar("columns", {length: 255}),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$default(() => new Date())
})

export const ProjectRelations = relations(Projectschema, ({ one }) => ({
    team: one(TeamSchema,{
        fields: [Projectschema.team],
        references: [TeamSchema.id]
    })
}));
