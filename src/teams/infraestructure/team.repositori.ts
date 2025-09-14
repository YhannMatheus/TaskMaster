import {database} from "@/database/connection";
import { TeamSchema, User2TeamsSchema } from "@/database/index.schema";
import { eq, and } from "drizzle-orm";

interface TeamData{
    name: string;
    description?: string;
}

export class TeamRepository {
    static async create(data: TeamData) {
        const [team] = await database
        .insert(TeamSchema)
        .values(data)
        .returning();
        return team;
    }

    static async findByName(name: string) {
        const team = await database
        .select()
        .from(TeamSchema)
        .where(eq(TeamSchema.name, name))
        .limit(1)
        return team;
    }

    static async findById(id: string) {
        const team = await database
        .select()
        .from(TeamSchema)
        .where(eq(TeamSchema.id, id))
        .limit(1)
        return team;
    }

    static async listAll(limit?: number, offset?: number) {
        const query = database
        .select()
        .from(TeamSchema);
        if (limit) query.limit(limit);
        if (offset) query.offset(offset);
        const teams = await query;
        return teams;
    }

    static async deleteById(id: string) {
        await database
        .delete(TeamSchema)
        .where(eq(TeamSchema.id, id));
    }

    static async collectAllInformations(id: string) {
        const team = await database
        .query
        .TeamSchema
        .findFirst({
            where: eq(TeamSchema.id, id),
                with: {
                    members: {
                        with: {
                            user: {
                                columns: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                }
                            }
                        },
                        columns: {
                            role: true,
                        }
                    },
                projects: true
                }
            }
        );
        
        return team;
    }

    static async addMember(userId: string, teamId: string, role: 'OWNER' | 'ADMIN' | 'MEMBER') {
        const [member] = await database
        .insert(User2TeamsSchema)
        .values({
            userId,
            teamId,
            role
        }).returning();

        return member;
    }

    static async checkMemberExists(userId: string, teamId: string) {
        const member = await database
        .select()
        .from(User2TeamsSchema)
        .where(and(
            eq(User2TeamsSchema.userId, userId),
            eq(User2TeamsSchema.teamId, teamId)
        ))
        .limit(1);
        
        return member.length > 0;
    }

    static async removeMemberWithConfirmation(userId: string, teamId: string) {
        const result = await database
        .delete(User2TeamsSchema)
        .where(and(
            eq(User2TeamsSchema.userId, userId),
            eq(User2TeamsSchema.teamId, teamId)
        ))
        .returning();
        
        return result.length > 0 ? result[0] : null;
    }

    static async listMembers(teamId: string) {
        const members = await database
        .select()
        .from(User2TeamsSchema)
        .where(eq(User2TeamsSchema.teamId, teamId));
        return members;
    }

    static async modifyMemberRole(userId: string, teamId: string, newRole: 'OWNER' | 'ADMIN' | 'MEMBER') {
        const [updatedMember] = await database
        .update(User2TeamsSchema)
        .set({ role: newRole })
        .where(and(
            eq(User2TeamsSchema.userId, userId),
            eq(User2TeamsSchema.teamId, teamId)
        ))
        .returning();
        return updatedMember;
    }
}