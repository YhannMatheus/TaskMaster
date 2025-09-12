import { database } from "@/database/connection";
import { userSchema } from "../domain/user.schema";
import { eq } from "drizzle-orm";


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
            .insert(userSchema)
            .values(userData)
            .returning();
        return newUser;
    }

    static async findByEmail(email: string) {
        const [user] = await database
        .select()
        .from(userSchema)
        .where(eq(userSchema.email, email))
        .limit(1);
        return user;
    }

    static async findByid(id: string) {
        const [user] = await database
        .select()
        .from(userSchema)
        .where(eq(userSchema.id, id))
        .limit(1);
        return user;
    }

    static async findAllUsers(pg: number = 1, limit: number = 10) {
        const users = await database
        .select()
        .from(userSchema)
        .offset((pg - 1) * limit)
        .limit(limit);
        return users;
    }

    static async deleteUser(id: string) {
        await database
        .delete(userSchema)
        .where(eq(userSchema.id, id));
    }

    static async updateUser(id: string, userData: Partial<UserData>) {
        const [updatedUser] = await database
        .update(userSchema)
        .set(userData)
        .where(eq(userSchema.id, id))
        .returning();
        return updatedUser;
    }

}