import { Elysia } from "elysia";
import { userRoutes } from "./users/infrastructure/user.controllers";
import { TeamRoutes } from "./teams/infraestructure/team.controller";
import { taskController } from "./tasks/infraestructure/task.controller";
import { ProjectController } from "./projects/infraestructure/project.controller";

const appRoutes = new Elysia()
.use(userRoutes)
.use(TeamRoutes)
.use(taskController)
.use(ProjectController)

export const AppRoutes = appRoutes;