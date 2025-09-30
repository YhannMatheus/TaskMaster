import { relations } from 'drizzle-orm';
import { UserSchema } from '@/users/domain/user.schema';
import { TeamSchema } from '@/teams/domain/team.schema';
import { pgTable, varchar, timestamp, unique } from 'drizzle-orm/pg-core';

export const User2TeamsSchema = pgTable('members', {
    userId: varchar('user_id', {length: 255}).notNull().references(() => UserSchema.id),
    teamId: varchar('team_id', {length: 255}).notNull().references(() => TeamSchema.id),
    role: varchar('role', { enum: ['OWNER', 'ADMIN', 'MEMBER'] }).notNull(),
    joinedAt: timestamp('joined_at').notNull().defaultNow(),
}, (t) => ({
    userTeamUnique: unique().on(t.userId, t.teamId),
}));

export const MemberRelations = relations(User2TeamsSchema, ({ one }) => ({
    user: one(UserSchema,{
        fields: [User2TeamsSchema.userId],
        references: [UserSchema.id]
    }),
    team: one(TeamSchema,{
        fields: [User2TeamsSchema.teamId],
        references: [TeamSchema.id]
    })
}))

