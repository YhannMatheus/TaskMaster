import { User2TeamsSchema } from "@/database/schemas/user-teams.schema";
import { relations } from "drizzle-orm";
import {createId} from "@paralleldrive/cuid2";
import { pgTable, pgEnum } from "drizzle-orm/pg-core";
import { varchar, timestamp } from "drizzle-orm/pg-core";


const RoleEnum = pgEnum("role", ["USER", "SUPPORT"]);

const InstitutionEnum = pgEnum("institution", [
    "UFPA",
    "UEPA",
    "IFPA",
    "CESUPA",
    "UNAMA",
    "FIBRA",
    "ESTACIO",
    "OUTRO",
    "NENHUMA"
]);

export const UserSchema = pgTable("users", {
    id :varchar("id", {length: 255}).$default(() => createId()).primaryKey(),
    firstName: varchar("first_name", {length: 255}).notNull(),
    lastName: varchar("last_name", {length: 255}),
    email: varchar("email", {length: 255}).notNull().unique(),
    password: varchar("password", {length: 255}).notNull(),
    role: RoleEnum('role').default('USER').notNull(),
    institution: InstitutionEnum('institution').default('NENHUMA'),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$default(() => new Date()),
    verificationDate: timestamp("verification_date"),
});

export const userRelations = relations(UserSchema, ({ many }) => ({
    teams: many(User2TeamsSchema)
}));
