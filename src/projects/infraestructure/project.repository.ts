import { database } from "@/database/connection";
import { ProjectSchema } from "@/projects/domain/project.schema";
import { eq } from "drizzle-orm";


export type Project = typeof ProjectSchema.$inferSelect;

export interface CreateProject {
    name: string;
    description: string | null;
    teamId: string;
}

export class ProjectRepository {
static async createProject(data: CreateProject): Promise<Project> {
    const [result] = await database
        .insert(ProjectSchema)
        .values({
            name: data.name,
            description: data.description,
            teamId: data.teamId,
        })
        .returning();

    return result;
}
    
    static async getProjectById(projectId: string): Promise<Project | undefined> {
        const [project] = await database
        .select()
        .from(ProjectSchema)
        .where(eq(ProjectSchema.id, projectId))
        .limit(1);
        return project;
    }

    static async getProjectsByTeamId(teamId: string): Promise<Project[]> {
        const projects = await database
        .select()
        .from(ProjectSchema)
        .where(eq(ProjectSchema.teamId, teamId));
        return projects;
    }

    static async updateProject(projectId: string, updateData: Partial<Project>): Promise<Project | undefined> {
        const [project] = await database
        .update(ProjectSchema)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(ProjectSchema.id, projectId))
        .returning();
        return project;
    }

    static async deleteProject(projectId: string): Promise<void> {
        await database
        .delete(ProjectSchema)
        .where(eq(ProjectSchema.id, projectId));
    }
}