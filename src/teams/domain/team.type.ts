import { Static, t } from 'elysia';

export const TeamType = t.Object({
    id: t.String(),
    name: t.String(),
    description: t.Nullable(t.String()),
    createdAt: t.Date(),
    updatedAt: t.Nullable(t.Date()),
    members: t.Array(t.Object({
        userId: t.String(),
        role: t.UnionEnum(['OWNER', 'ADMIN', 'MEMBER']),
    })),
    projects: t.Nullable(t.Array(t.Object({
        id: t.String(),
        name: t.String(),
    })))
})

export type Team = Static<typeof TeamType>;