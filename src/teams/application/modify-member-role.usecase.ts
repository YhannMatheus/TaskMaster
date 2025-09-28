import { TeamNotFoundError } from "@/core/errors/team-not-found-error";
import { TeamRepository } from "../infraestructure/team.repositori";
import { UserNotFoundError } from "@/core/errors/user-not-found-error";
import { InternalServerError } from "@/core/errors/internal-server-error";

export async function modifyMemberRole(userId: string, teamId: string, role: 'OWNER' | 'ADMIN' | 'MEMBER') {
    const team = await TeamRepository.findById(teamId);
    if (team.length === 0) {
        throw new TeamNotFoundError();
    }
    
    const memberExists = await TeamRepository.checkMemberExists(userId, teamId);
    if (!memberExists) {
        throw new UserNotFoundError();
    }

    const updatedMember = await TeamRepository.modifyMemberRole(userId, teamId, role);
    if (!updatedMember) {
        throw new InternalServerError();
    }
    
    return updatedMember;
}