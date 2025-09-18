import { pgEnum, pgTable } from "drizzle-orm/pg-core";
import { varchar, timestamp } from "drizzle-orm/pg-core";
import {createId} from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { ProjectSchema, ColumSchema, userSchema } from "@/database/index.schema";

const StatusEnum = pgEnum("task_status", ["pending", "in_progress", "completed", "on_hold", "cancelled"]);
const PriorityEnum = pgEnum("task_priority", ["low", "medium", "high", "urgent"]);


export const TaskSchema = pgTable("tasks", {
    id: varchar("id", { length: 255 }).primaryKey().$default(() => createId()),
    title: varchar("title", { length: 255 }).notNull(),
    description: varchar("description", { length: 1000 }),
    projectId: varchar("project_id").notNull().references(() => ProjectSchema.id, { onDelete: "cascade" }),
    columnId: varchar("column_id").notNull().references(() => ColumSchema.id, { onDelete: "cascade" }),
    inChargeUserId: varchar("in_charge_user_id", { length: 255 }).references(() => userSchema.id, { onDelete: "set null" }),
    status: StatusEnum("status").notNull().default("pending"),
    priority: PriorityEnum("priority").notNull().default("medium"),
    dueDate: timestamp("due_date"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const taskRelations = relations(TaskSchema, ({ one }) => ({
    project: one(ProjectSchema, { fields: [TaskSchema.projectId], references: [ProjectSchema.id] }),
    column: one(ColumSchema, { fields: [TaskSchema.columnId], references: [ColumSchema.id] }),
    inChargeUser: one(userSchema, { fields: [TaskSchema.inChargeUserId], references: [userSchema.id] }),
}))