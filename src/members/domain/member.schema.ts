import { pgTable, varchar, timestamp, unique } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { userSchema } from '../../users/domain/user.schema';
import { TeamSchema } from '../../teams/domain/teams.schema';

export const MemberSchema = pgTable('members', {
    id :varchar("id", {length: 255}).$default(() => createId()).primaryKey(),
    userId: varchar('user_id', {length: 255}).notNull().references(() => userSchema.id),
    teamId: varchar('team_id', {length: 255}).notNull().references(() => TeamSchema.id),
    role: varchar('role', { enum: ['OWNER', 'ADMIN', 'MEMBER'] }).notNull(),
    joinedAt: timestamp('joined_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
}, (t) => ({
    userTeamUnique: unique().on(t.userId, t.teamId),
}));

export const MemberRelations = relations(MemberSchema, ({ one }) => ({
    user: one(userSchema,{
        fields: [MemberSchema.userId],
        references: [userSchema.id]
    }),
    team: one(TeamSchema,{
        fields: [MemberSchema.teamId],
        references: [TeamSchema.id]
    })
}))

