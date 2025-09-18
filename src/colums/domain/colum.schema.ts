import { relations } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { varchar } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { timestamp } from "drizzle-orm/pg-core";
import { TaskSchema } from "@/tasks/domain/task.schema";
import { ProjectSchema } from "@/database/index.schema";

export const ColumSchema = pgTable("colums", {
    id: varchar("id", { length: 25 }).primaryKey().$default(() => createId()),
    name: varchar("name", { length: 255 }).notNull(),
    projectId: varchar("project_id", { length: 25 }).notNull().references(() => ProjectSchema.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const ColunsRelation = relations(ColumSchema, ({ one, many }) => ({
    project: one(ProjectSchema, { fields: [ColumSchema.projectId], references: [ProjectSchema.id] }),
    tasks: many(TaskSchema)
}))