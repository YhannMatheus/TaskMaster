import { database } from "@/database/connection";
import { UserSchema } from "../domain/user.schema";
import { eq } from "drizzle-orm";
import { TeamSchema, User2TeamsSchema } from "@/database/index.schema";


interface UserData{
    id?: string;
    email: string;
    password: string;
    firstName: string;
    lastName?: string;
    role?: 'USER' | 'SUPPORT';
    instituition: "UFPA" | "UEPA" | "IFPA" | "CESUPA" | "UNAMA" | "FIBRA" | "ESTACIO" | "OUTRO" | "NENHUMA";
    createdAt?: Date;
    updatedAt?: Date;

}

export class UserRepository {
    static async createUser(userData : UserData) {
        const [newUser] = await database
        .insert(UserSchema)
        .values(userData)
        .returning();
        return newUser;
    }

    static async findByEmail(email: string) {
        const [user] = await database
        .select()
        .from(UserSchema)
        .where(eq(UserSchema.email, email))
        .limit(1);
        return user;
    }

    static async findByid(id: string) {
        const [user] = await database
        .select()
        .from(UserSchema)
        .where(eq(UserSchema.id, id))
        .limit(1);
        return user;
    }

    static async findAllUsers(pg: number = 1, limit: number = 10) {
        const users = await database
        .select()
        .from(UserSchema)
        .offset((pg - 1) * limit)
        .limit(limit);
        return users;
    }

    static async deleteUser(id: string) {
        await database
        .delete(UserSchema)
        .where(eq(UserSchema.id, id));
    }

    static async updateUser(id: string, userData: Partial<UserData>) {
        const [updatedUser] = await database
        .update(UserSchema)
        .set(userData)
        .where(eq(UserSchema.id, id))
        .returning();
        return updatedUser;
    }

    static async profileuser(id: string) {
        // Buscar o usuário
        const [user] = await database
        .select({
            id: UserSchema.id,
            firstName: UserSchema.firstName,
            lastName: UserSchema.lastName,
            email: UserSchema.email,
            role: UserSchema.role,
            instituition: UserSchema.instituition,
            createdAt: UserSchema.createdAt,
            updatedAt: UserSchema.updatedAt
        })
        .from(UserSchema)
        .where(eq(UserSchema.id, id))
        .limit(1);

        if (!user) {
            return null;
        }

        // Buscar os teams do usuário com JOIN otimizado
        const userTeams = await database
        .select({
            teamId: User2TeamsSchema.teamId,
            role: User2TeamsSchema.role,
            joinedAt: User2TeamsSchema.joinedAt,
            teamName: TeamSchema.name,
            teamDescription: TeamSchema.description
        })
        .from(User2TeamsSchema)
        .innerJoin(TeamSchema, eq(User2TeamsSchema.teamId, TeamSchema.id))
        .where(eq(User2TeamsSchema.userId, id));

        // Formatar os teams
        const teams = userTeams.map(userTeam => ({
            id: userTeam.teamId,
            name: userTeam.teamName,
            description: userTeam.teamDescription,
            role: userTeam.role,
            joinedAt: userTeam.joinedAt
        }));

        return {
            ...user,
            teams
        };
    }

}