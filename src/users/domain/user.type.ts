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

export type User = Static<typeof UserType>