import { Elysia, t } from "elysia";
import { ColumnRepository } from "./column.repository";
import { authMiddleware } from "@/core/middleware/auth.middleware";

export const ColumnController = new Elysia({
    prefix: "/api/columns",
    tags: ["Columns"]
})
.use(authMiddleware)
.post("/", async (context: any) => {
    const { body, authenticated, set } = context;

    if (!authenticated) {
        set.status = 401;
        return { error: 'Não autorizado' };
    }

    try {
        const column = await ColumnRepository.createColumn(body);
        set.status = 201;
        return column;
    } catch (error) {
        set.status = 500;
        return { error: "Erro interno do servidor" };
    }
}, {
    body: t.Object({
        name: t.String(),
        projectId: t.String()
    }),
    response: {
        201: t.Object({
            id: t.String(),
            name: t.String(),
            projectId: t.String(),
            createdAt: t.Union([t.Date(), t.Null()]),
            updatedAt: t.Union([t.Date(), t.Null()]),
        }),
        401: t.Object({
            error: t.String()
        }),
        500: t.Object({
            error: t.String()
        })
    },
    detail: {
        summary: "Criar coluna",
        description: "Cria uma nova coluna em um projeto."
    }
})

.get("/project/:projectId", async (context: any) => {
    const { params, authenticated, set } = context;
    const { projectId } = params;

    if (!authenticated) {
        set.status = 401;
        return { error: 'Não autorizado' };
    }

    try {
        const columns = await ColumnRepository.getColumnsByProjectId(projectId);
        set.status = 200;
        return { columns };
    } catch (error) {
        set.status = 500;
        return { error: "Erro interno do servidor" };
    }
}, {
    params: t.Object({
        projectId: t.String()
    }),
    response: {
        200: t.Object({
            columns: t.Array(t.Object({
                id: t.String(),
                name: t.String(),
                projectId: t.String(),
                createdAt: t.Union([t.Date(), t.Null()]),
                updatedAt: t.Union([t.Date(), t.Null()]),
            }))
        }),
        401: t.Object({
            error: t.String()
        }),
        500: t.Object({
            error: t.String()
        })
    },
    detail: {
        summary: "Listar colunas do projeto",
        description: "Lista todas as colunas de um projeto específico."
    }
})

.get("/:id", async (context: any) => {
    const { params, authenticated, set } = context;
    const { id } = params;

    if (!authenticated) {
        set.status = 401;
        return { error: 'Não autorizado' };
    }

    try {
        const column = await ColumnRepository.getColumnById(id);
        
        if (!column) {
            set.status = 404;
            return { error: "Coluna não encontrada" };
        }
        
        set.status = 200;
        return column;
    } catch (error) {
        set.status = 500;
        return { error: "Erro interno do servidor" };
    }
}, {
    params: t.Object({
        id: t.String()
    }),
    response: {
        200: t.Object({
            id: t.String(),
            name: t.String(),
            projectId: t.String(),
            createdAt: t.Union([t.Date(), t.Null()]),
            updatedAt: t.Union([t.Date(), t.Null()]),
        }),
        401: t.Object({
            error: t.String()
        }),
        404: t.Object({
            error: t.String()
        }),
        500: t.Object({
            error: t.String()
        })
    },
    detail: {
        summary: "Obter coluna por ID",
        description: "Busca uma coluna específica pelo seu ID."
    }
})

.put("/:id", async (context: any) => {
    const { params, body, authenticated, set } = context;
    const { id } = params;

    if (!authenticated) {
        set.status = 401;
        return { error: 'Não autorizado' };
    }

    try {
        const column = await ColumnRepository.updateColumn(id, body);
        
        if (!column) {
            set.status = 404;
            return { error: "Coluna não encontrada" };
        }
        
        set.status = 200;
        return column;
    } catch (error) {
        set.status = 500;
        return { error: "Erro interno do servidor" };
    }
}, {
    params: t.Object({
        id: t.String()
    }),
    body: t.Object({
        name: t.Optional(t.String()),
    }),
    response: {
        200: t.Object({
            id: t.String(),
            name: t.String(),
            projectId: t.String(),
            createdAt: t.Union([t.Date(), t.Null()]),
            updatedAt: t.Union([t.Date(), t.Null()]),
        }),
        401: t.Object({
            error: t.String()
        }),
        404: t.Object({
            error: t.String()
        }),
        500: t.Object({
            error: t.String()
        })
    },
    detail: {
        summary: "Atualizar coluna",
        description: "Atualiza uma coluna existente."
    }
})

.delete("/:id", async (context: any) => {
    const { params, authenticated, set } = context;
    const { id } = params;

    if (!authenticated) {
        set.status = 401;
        return { error: 'Não autorizado' };
    }

    try {
        await ColumnRepository.deleteColumn(id);
        set.status = 204;
        return {
            status: "204",
            message: "Coluna deletada com sucesso"
        };
    } catch (error) {
        set.status = 500;
        return { error: "Erro interno do servidor" };
    }
}, {
    params: t.Object({
        id: t.String()
    }),
    response: {
        204: t.Object({
            status: t.String(),
            message: t.String()
        }),
        401: t.Object({
            error: t.String()
        }),
        500: t.Object({
            error: t.String()
        })
    },
    detail: {
        summary: "Deletar coluna",
        description: "Deleta uma coluna pelo seu ID."
    }
});