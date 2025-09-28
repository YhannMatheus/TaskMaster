import { InternalServerError } from "elysia";
import { TeamRepository } from "../infraestructure/team.repositori";
import { TeamAlreadyExistsError } from "@/core/errors/team-aleady-exists-error";

export async function createTeam(params: { name: string; description?: string }, userId: string) {
    try{
        const teamAlreadyExists = await TeamRepository.findByName(params.name);
    
        if (teamAlreadyExists.length) {
            throw new TeamAlreadyExistsError();
        }

        const team = await TeamRepository.create(params, userId);
    
        return team;
    } catch (error) {
        throw new InternalServerError('Error creating team');
    }
}