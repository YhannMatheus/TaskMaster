import Elysia from "elysia";
import { userRoutes } from "./users/infrastructure/user.controllers";

const routes = new Elysia({
    prefix: "/taskmaster/api/v1",
})
.use(userRoutes)


export { routes as AppRoutes }