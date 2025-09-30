import { Elysia, InternalServerError, t } from "elysia";
import { authMiddleware, AuthenticatedUser } from "@/core/middleware/auth.middleware";
import { createTask } from "../aplication/create-task.usecase";
import { UnauthorizedError } from "@/core/errors/unauthorized-error";
import { UserNotFoundError } from "@/core/errors/user-not-found-error";
import { InvalidCredentialsError } from "@/core/errors/invalid-credentials-error";
import { updateTask } from "../aplication/update-task.usecase";

export const taskController = new Elysia({
    prefix: "/tasks",
    tags: ["Tasks"]
})
.use(authMiddleware)

.post("/", async (context: any) => {
    const { body, authenticated, set } = context;
    const user = authenticated as AuthenticatedUser;
    if (user.userId != null){
        try{
            const task = await createTask(body);
            
            set.status = 201;
            return {
                status: "201",
                data: task
            }

        }catch(error){
            if (error instanceof UnauthorizedError){
                set.status = 401;
                return {
                    status: "401",
                    message: error.message
                }
            }
            if (error instanceof UserNotFoundError){
                set.status = 404;
                return {
                    status: "404",
                    message: error.message
                }
            }
            if (error instanceof InternalServerError){
                set.status = 500;
                return {
                    status: "500",
                    message: error.message
                }
            }
            if (error instanceof InvalidCredentialsError){
                set.status = 400;
                return {
                    status: "400",
                    message: error.message
                }
            }
            set.status = 500;
            return { error: "Internal Server Error" };
        }
    }

},{
    body: t.Object({
        title: t.Optional(t.String()),
        description: t.Optional(t.String()),
        projectId: t.Optional(t.String()),
        columnId: t.Optional(t.String()),
        inChargeUserId: t.Optional(t.String()),
        status: t.Optional(t.UnionEnum(['pending', 'in_progress', 'completed', 'on_hold', 'cancelled'])),
        priority: t.Optional(t.UnionEnum(['low', 'medium', 'high', 'urgent'])),
        dueDate: t.Optional(t.String())
    }),
    response: {
        201: t.Object({
            status: t.String(),
            data: t.Object({
                id: t.String(),
                title: t.String(),
                description: t.String(),
                projectId: t.String(),
                columnId: t.String(),
                inChargeUserId: t.String(),
                status: t.String(),
                priority: t.String(),
                dueDate: t.String()
            })}
        ),
        400: t.Object({
            status: t.String(),
            message: t.String()
        }),
        401: t.Object({
            status: t.String(),
            message: t.String()
        }),
        404: t.Object({
            status: t.String(),
            message: t.String()
        }),
        500: t.Object({
            status: t.String(),
            message: t.String()
        })
        },
    detail: {
        summary: "Cria uma nova tarefa",
        description: "Endpoint para criar uma nova tarefa. Requer autenticação."
    }
})
.get("/", async (context: any) => {
    const { authenticated, set, body } = context;
    const user = authenticated as AuthenticatedUser;

    if (user.userId != null){
        try{
            const task = await updateTask(body);

            set.status = 200;
            return {
                status: "200",
                data: task
            }
        }catch(error){
            if (error instanceof UnauthorizedError){
                set.status = 401;
                return {
                    status: "401",
                    message: error.message
                }
            }
            
            set.status = 500;
            return { error: "Internal Server Error" };
        }
    }else{
        set.status = 401;
        return {
            status: "401",
            message: "Unauthorized"
        }
    }
},{
    body: t.Object({
        title: t.Optional(t.String()),
        description: t.Optional(t.String()),
        projectId: t.Optional(t.String()),
        columnId: t.Optional(t.String()),
        inChargeUserId: t.Optional(t.String()),
        status: t.Optional(t.UnionEnum(['pending', 'in_progress', 'completed', 'on_hold', 'cancelled'])),
        priority: t.Optional(t.UnionEnum(['low', 'medium', 'high', 'urgent'])),
        dueDate: t.Optional(t.String())
    }),
})