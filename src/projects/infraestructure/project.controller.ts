import {Elysia, t} from "elysia"
import { ProjectRepository } from "./project.repository";
import { authMiddleware, AuthenticatedUser } from "@/core/middleware/auth.middleware";
import { createProject } from "../aplication/create-project.usecase";


export const ProjectController = new Elysia({
    prefix: "/projects",
    tags: ["Projects"]
})
.use(authMiddleware)

.post("/", async (context: any) => {
    const { body, authenticated, set } = context;

    try {
        const project = await createProject(body);
        set.status = 201;
        return project;

    } catch (error) {
        console.error('Erro ao criar projeto:', error);
        set.status = 500;
        return { error: "Internal Server Error" };
    }
}, {
    body: t.Object({
        name: t.String(),
        description: t.Optional(t.String()),
        teamId: t.String()
    }),
    response: {
        201: t.Object({
            id: t.String(),
            name: t.String(),
            teamId: t.String(),
            description: t.Optional(t.String()),
            createdAt: t.Optional(t.String()),
            updatedAt: t.Optional(t.String()),
        }),
        500: t.Object({
            error: t.String()
        })
    }
})

.delete("/:projectId", async (context: any) => {
    const { params, authenticated, set } = context;
    const user = authenticated as AuthenticatedUser;
    const { projectId } = params;

    if (user.userId != null) {
        try {
            await ProjectRepository.deleteProject(projectId);
            set.status = 204;
            return{
                status: "204",
                message: "Project deleted successfully"
            };

        } catch (error) {
            set.status = 500;
            return { error: "Internal Server Error" };
        }
    } else {
        set.status = 401;
        return { error: "Unauthorized" };
    }
},{
    params: t.Object({
        projectId: t.String()
    }),
    response: t.Object({
        status: t.String(),
        message: t.String()
    }).optional(),
    detail:{
        summary: "Delete a project",
        description: "Deletes a project by its ID."
    }
})