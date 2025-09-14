import { Static, t } from "elysia"

export const UserType = t.Object({
    id: t.Nullable(t.String()),
    firstName: t.String(),
    lastName: t.Nullable(t.String()),
    email: t.String().defaults(""),
    password: t.String(),
    role: t.UnionEnum(["USER", "SUPPORT"]),
    instituition: t.Nullable(t.UnionEnum(["UFPA", "UEPA", "IFPA", "CESUPA", "UNAMA", "FIBRA", "ESTACIO", "OUTRO", "NENHUMA"]).defaults("NENHUMA")),
    createdAt: t.Nullable(t.Date()),
    updatedAt: t.Nullable(t.Date()),
})

export const UserProfileResponseType = t.Object({
    user: t.Object({
        id: t.String(),
        firstName: t.String(),
        lastName: t.Union([t.String(), t.Null()]),
        email: t.String(),
        role: t.Union([t.Literal("USER"), t.Literal("SUPPORT")]),
        instituition: t.Union([
            t.Literal("UFPA"), t.Literal("UEPA"), t.Literal("IFPA"),
            t.Literal("CESUPA"), t.Literal("UNAMA"), t.Literal("FIBRA"),
            t.Literal("ESTACIO"), t.Literal("OUTRO"), t.Literal("NENHUMA"),
            t.Null()
        ]),
        createdAt: t.Union([t.Date(), t.Null()]),
        updatedAt: t.Union([t.Date(), t.Null()]),
        teams: t.Array(t.Object({
            id: t.String(),
            name: t.String(),
            description: t.String(),
            role: t.Union([t.Literal("OWNER"), t.Literal("ADMIN"), t.Literal("MEMBER")]),
            joinedAt: t.Date()
        }))
    })
});

export type User = Static<typeof UserType>
export type UserProfileResponse = Static<typeof UserProfileResponseType>