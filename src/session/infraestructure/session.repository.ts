import { database } from "@/database/connection";
import { SessionSchema } from "../domain/session.schema";
import { desc, eq, and, gt, lt } from "drizzle-orm";

interface Session {
    id?: string;
    email: string;
    token: string;
    type: "email_verification" | "password_reset" | "two_factor" | "login_verification";
    createdAt?: Date | null;
    expiresAt?: Date | null;
    attempts?: number;
    maxAttempts?: number;
    used?: boolean;
    data?: string | null;
}

export class SessionRepository {
    static async createSession(session: Session): Promise<Session> {
        const sessionData = {
            email: session.email,
            token: session.token,
            type: session.type,
            expiresAt: session.expiresAt || new Date(Date.now() + 10 * 60 * 1000), // 10 min default
            attempts: session.attempts || 0,
            maxAttempts: session.maxAttempts || 3,
            used: session.used || false,
            data: session.data || null
        };

        const [insertedSession] = await database
        .insert(SessionSchema)
        .values(sessionData)
        .returning();

        return insertedSession;
    }

    static async findByEmailAndType(email: string, type: "email_verification" | "password_reset" | "two_factor" | "login_verification"): Promise<Session | undefined> {
        const [session] = await database
        .select()
        .from(SessionSchema)
        .where(and(
            eq(SessionSchema.email, email),
            eq(SessionSchema.type, type)
        ))
        .orderBy(desc(SessionSchema.createdAt))
        .limit(1);
        return session;
    }

    static async deleteSession(id: string): Promise<void> {
        await database
        .delete(SessionSchema)
        .where(eq(SessionSchema.id, id));
    }

    static async findById(id: string): Promise<Session | undefined> {
        const [session] = await database
        .select()
        .from(SessionSchema)
        .where(eq(SessionSchema.id, id))
        .limit(1);
        return session;
    }

    static async findByToken(token: string): Promise<Session | undefined> {
        const [session] = await database
        .select()
        .from(SessionSchema)
        .where(eq(SessionSchema.token, token))
        .limit(1);
        return session;
    }

    static async updateSession(id: string, updates: Partial<Session>): Promise<Session | undefined> {
        // Filtra valores null/undefined que não são aceitos pelo schema
        const cleanUpdates: any = {};
        Object.keys(updates).forEach(key => {
            const value = (updates as any)[key];
            if (value !== null && value !== undefined) {
                cleanUpdates[key] = value;
            }
        });

        const [updatedSession] = await database
        .update(SessionSchema)
        .set(cleanUpdates)
        .where(eq(SessionSchema.id, id))
        .returning();
        return updatedSession;
    }

    static async deleteExpiredSessions(): Promise<void> {
        await database
        .delete(SessionSchema)
        .where(lt(SessionSchema.expiresAt, new Date()));
    }

    static async deleteSessionsByEmail(email: string): Promise<void> {
        await database
        .delete(SessionSchema)
        .where(eq(SessionSchema.email, email));
    }

    static async countActiveSessionsByEmail(email: string): Promise<number> {
        const count = await database
        .select()
        .from(SessionSchema)
        .where(and(
            eq(SessionSchema.email, email),
            gt(SessionSchema.expiresAt, new Date())
        ));
        return Number(count.length) || 0;
    }
}