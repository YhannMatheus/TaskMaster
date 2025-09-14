import {database} from "@/database/connection";
import { TeamSchema } from "@/database/index.schema";
import { eq } from "drizzle-orm";

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
}