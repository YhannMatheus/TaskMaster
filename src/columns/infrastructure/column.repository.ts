import { database } from "@/database/connection";
import { ColumSchema } from "@/colums/domain/colum.schema";
import { eq } from "drizzle-orm";

export type Column = typeof ColumSchema.$inferSelect;

export interface CreateColumn {
    name: string;
    projectId: string;
}

export class ColumnRepository {
    static async createColumn(data: CreateColumn): Promise<Column> {
        const [result] = await database
            .insert(ColumSchema)
            .values({
                name: data.name,
                projectId: data.projectId,
            })
            .returning();

        return result;
    }
    
    static async getColumnById(columnId: string): Promise<Column | undefined> {
        const [column] = await database
            .select()
            .from(ColumSchema)
            .where(eq(ColumSchema.id, columnId))
            .limit(1);
        return column;
    }

    static async getColumnsByProjectId(projectId: string): Promise<Column[]> {
        const columns = await database
            .select()
            .from(ColumSchema)
            .where(eq(ColumSchema.projectId, projectId));
        return columns;
    }

    static async updateColumn(columnId: string, updateData: Partial<Column>): Promise<Column | undefined> {
        const [column] = await database
            .update(ColumSchema)
            .set({ ...updateData, updatedAt: new Date() })
            .where(eq(ColumSchema.id, columnId))
            .returning();
        return column;
    }

    static async deleteColumn(columnId: string): Promise<void> {
        await database
            .delete(ColumSchema)
            .where(eq(ColumSchema.id, columnId));
    }
}