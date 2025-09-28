import { Context, Elysia } from "elysia";
import { TaskRepository } from "./task.repository";
import { authMiddleware, AuthenticatedUser } from "@/core/middleware/auth.middleware";

export const taskController = new Elysia({
    prefix: "/tasks",
    tags: ["Tasks"]
})
.use(authMiddleware)

.post("/:taskId", async (context: any) => {
    const user = await context.authenticated;
    const { taskId } = context.params;

})