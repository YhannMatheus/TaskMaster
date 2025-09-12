import { MemberSchema } from "../../members/domain/member.schema";
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

export const userSchema = pgTable("users", {
    id :varchar("id", {length: 255}).$default(() => createId()).primaryKey(),
    firstName: varchar("first_name", {length: 255}).notNull(),
    lastName: varchar("last_name", {length: 255}),
    email: varchar("email", {length: 255}).notNull().unique(),
    password: varchar("password", {length: 255}).notNull(),
    role: RoleEnum('role').default('USER').notNull(),
    instituition: InstitutionEnum('institution').default('NENHUMA'),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().$default(() => new Date())
});

export const userRelations = relations(userSchema, ({ many }) => ({
    memberships: many(MemberSchema)
}));
