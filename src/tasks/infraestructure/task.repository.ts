import { TaskSchema } from "../domain/task.schema";
import { asc, eq} from "drizzle-orm";
import { database } from "@/database/connection";
import { UserSchema } from "@/database/index.schema";

export interface Task {
    id: string;
    title: string | null;
    description: string | null;
    projectId: string;
    columnId: string;
    inChargeUserId: string | null;
    status: 'pending' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
    priority: 'low' | 'medium' | 'high' | 'urgent' | null;
    dueDate: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};

export class TaskRepository {
    static async createTask(task: Task): Promise<Task> {
        const [taskData] = await database
        .insert(TaskSchema)
        .values({...task})
        .returning();
        return taskData;
    }

    static async modifyColumnTask(taskId: string, columnId: string): Promise<Task | undefined> {
        
        const [task] = await database
        .update(TaskSchema)
        .set({ 
            columnId: columnId, 
            updatedAt: new Date() 
        })
        .where(eq(TaskSchema.id, taskId))
        .returning();

        return task;
    }
    
    static async assignUserToTask(taskId: string, userId: string | null): Promise<Task | undefined> {
        const [task] = await database
        .update(TaskSchema)
        .set({ 
            inChargeUserId: userId, 
            updatedAt: new Date() 
        })
        .where(eq(TaskSchema.id, taskId))
        .returning();
        return task;
    }

    static async getTasksByProjectId(projectId: string): Promise<Task[]> {
        const tasks = await database
        .select()
        .from(TaskSchema)
        .where(eq(TaskSchema.projectId, projectId))
        .orderBy(asc(TaskSchema.createdAt));
        
        return tasks;
    }

    static async getTaskById(taskId: string) {
        const [task] = await database
        .select()
        .from(TaskSchema)
        .leftJoin(UserSchema, eq(TaskSchema.inChargeUserId, UserSchema.id))
        .where(eq(TaskSchema.id, taskId))
        .limit(1);
        return task;
    }

    static async getTaskByTitle(title: string) {
        const [task] = await database
        .select()
        .from(TaskSchema)
        .where(eq(TaskSchema.title, title))
        .limit(1);
        return task;
    }
    
    static async deleteTask(taskId: string): Promise<void> {
        await database
        .delete(TaskSchema)
        .where(eq(TaskSchema.id, taskId));
    }

    static async listAllForProject( projectId: string, page: number, limit: number, search?: string, sortBy?: string, ) {
        const offset = (page - 1) * limit;

        const tasks = await database
        .select({
            title: TaskSchema.title,
            description: TaskSchema.description,
            dueDate: TaskSchema.dueDate,
            priority: TaskSchema.priority,
            status: TaskSchema.status,
            inChargeUserId: TaskSchema.inChargeUserId,
            createdAt: TaskSchema.createdAt, 
        })
        .from(TaskSchema)
        .where(eq(TaskSchema.projectId, projectId))
        .limit(limit)
        .offset(offset);

        return tasks ;
    }
}