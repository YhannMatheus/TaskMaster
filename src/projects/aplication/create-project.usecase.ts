import { ProjectRepository } from "../infraestructure/project.repository";

export async function createProject(data: { 
    name: string; 
    description: string | null; 
    teamId: string 
}) {
    if(!data.name || !data.teamId) {
        throw new Error("Name and TeamId are required");
    }
    
    if (data.description && typeof data.description !== 'string') {
        throw new Error("Description must be a string");
    }

    const project = await ProjectRepository.createProject({
        name: data.name,
        description: data.description || null,
        teamId: data.teamId,
    });
    
    return project;
}