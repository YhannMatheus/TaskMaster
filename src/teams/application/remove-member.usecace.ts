import { TeamNotFoundError } from "@/core/errors/team-not-found-error";
import { TeamRepository } from "../infraestructure/team.repositori";
import { UserNotFoundError } from "@/core/errors/user-not-found-error";
import { InternalServerError } from "@/core/errors/internal-server-error";

export async function removeMember(userId: string, teamId: string) {
    const team = await TeamRepository.findById(teamId);
    if (team.length === 0) {
        throw new TeamNotFoundError();
    }

    const memberExists = await TeamRepository.checkMemberExists(userId, teamId);
    if (!memberExists) {
        throw new UserNotFoundError();
    }

    const removedMember = await TeamRepository.removeMember(userId, teamId);
    if (!removedMember) {
        throw new InternalServerError();
    }
    if(!removedMember){
        throw new InternalServerError();
    }
    return removedMember;
}