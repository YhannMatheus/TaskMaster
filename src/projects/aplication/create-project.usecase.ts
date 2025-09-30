import { InvalidProjectDataError } from "@/core/errors/invalid-project-data-error";
import { ProjectRepository } from "../infraestructure/project.repository";

export async function createProject(data: { 
    name: string; 
    description: string | null; 
    teamId: string 
}) {
    if(!data.name || !data.teamId) {
        throw new InvalidProjectDataError();
    }
    
    const project = await ProjectRepository.createProject({
        name: data.name,
        description: data.description,
        teamId: data.teamId,
    });
    
    return project;
}