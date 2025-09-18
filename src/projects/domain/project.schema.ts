import { pgTable } from "drizzle-orm/pg-core"
import { varchar, timestamp } from "drizzle-orm/pg-core"
import {createId} from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { TeamSchema } from "@/database/index.schema";
import { ColumSchema } from "@/colums/domain/colum.schema";
import { TaskSchema } from "@/tasks/domain/task.schema";

export const ProjectSchema = pgTable("projects",{
    id :varchar("id", {length: 255}).$default(() => createId()).primaryKey(),
    teamId: varchar('team_id', {length: 255}).notNull().references(() => TeamSchema.id, { onDelete: "cascade" }),
    name: varchar("name", {length: 255}).notNull(),
    description: varchar("description", {length: 500}),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$default(() => new Date())
})

export const ProjectRelations = relations(ProjectSchema, ({ one, many }) => ({
    team: one(TeamSchema, {
        fields: [ProjectSchema.teamId],
        references: [TeamSchema.id]
    }),
    columns: many(ColumSchema),
    tasks: many(TaskSchema)
}));
