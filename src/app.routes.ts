import { Elysia } from "elysia";
import { userRoutes } from "./users/infrastructure/user.controllers";
import { TeamRoutes } from "./teams/infraestructure/team.controller";

const appRoutes = new Elysia()
.use(userRoutes)
.use(TeamRoutes);

export const AppRoutes = appRoutes;