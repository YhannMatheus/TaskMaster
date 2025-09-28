import { cookie } from './../../../node_modules/@elysiajs/cookie/src/index';
import {Elysia, InternalServerError, t} from 'elysia'
import { TeamRepository } from "./team.repositori";
import { TeamType } from '../domain/team.type';
import {
    UnauthorizedError
} from "@/core/errors/index.error"
import { authMiddleware, AuthenticatedUser } from '@/core/middleware/auth.middleware';
import { createTeam } from '../application/create-team.usecase';
import { removeMember } from '../application/remove-member.usecace';
import { modifyMemberRole } from '../application/modify-member-role.usecase';

export const TeamRoutes = new Elysia({
    prefix: '/teams',
    tags: ['Teams']
})
.use(authMiddleware)

.post('/', async(context: any) => {
    const { body, authenticated, set } = context;
    const user = authenticated as AuthenticatedUser;
    if(user.userId != null){
        try{
            const team = await createTeam(body, user.userId);

            set.status = 201;
            return{
                status : "201",
                data: team
            }

        }catch(error){
            if (error instanceof UnauthorizedError){
                set.status = 401;
                return {
                    status: "401",
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
            set.status = 500;
            return {
                status: "500",
                message: 'Internal server error'
            }
        }
    }
}, {
    body: t.Object({
        name: t.String(),
        description: t.Optional(t.String())
    }),
    response: {
        201: t.Object({
            status: t.String(),
            data: t.Object({
                id: t.String(),
                name: t.String(),
                description: t.Optional(t.String())
            })
        }),
        401: t.Object({
            status: t.String(),
            message: t.String()
        }),
        500: t.Object({
            status: t.String(),
            message: t.String()
        })
    },
    detail:{
        summary: "Criar um novo time",
        description: "Cria um novo time no sistema. O usuário autenticado será adicionado como OWNER do time.",
        tags: ["Teams"]
    }
})

.delete('/:teamId', async(context: any) => {
    const { authenticated, set, params } = context;
    const teamId = params.teamId;
    if (authenticated && authenticated.role === 'SUPPORT') {
        try {
            await TeamRepository.deleteById(teamId);
            
            set.status = 204;
            
            return;

        } catch (error) {
            set.status = 500;
            return {
                status: "500",
                message: "Internal server error"
            }
        }

    }else{

        set.status = 401;
        return {
            status: "401",
            message: "Unauthorized"
        }
    }
})

.delete('/:teamId/:userId', async(context: any) => {
    const { authenticated, set, params } = context;
    const teamId = params.teamId;
    const userId = params.userId;

    const admin = await TeamRepository.getMember(authenticated.userId, teamId);
    
    try{
        if (authenticated && admin?.role === 'ADMIN') {
            const memberRemoved = await removeMember(userId, teamId)
            
            set.status = 200;
            return {
                status: "200",
                data: memberRemoved
            }

        } else {
            throw new UnauthorizedError();
        }
    }catch(error){
        if (error instanceof UnauthorizedError){
            set.status = 401;
            return {
                status: "401",
                message: error.message
            }
        }
    }
})

.put('/:teamId/:userId', async(context: any) => {
    const { authenticated, set, params, body } = context;
    const teamId = params.teamId;
    const userId = params.userId;
    const role = body.role as 'OWNER' | 'ADMIN' | 'MEMBER';

    try {
        // Verifica se está autenticado
        if (!authenticated) {
            set.status = 401;
            return {
                status: "401",
                message: "Usuário não autenticado"
            };
        }

        // Busca o membro que está fazendo a requisição
        const requester = await TeamRepository.getMember(authenticated.userId, teamId);

        // Verifica se o usuário faz parte do time
        if (!requester) {
            set.status = 401;
            return {
                status: "401",
                message: "Usuário não é membro do time"
            };
        }

        // Verifica se tem permissão (ADMIN ou OWNER)
        if (requester.role !== 'ADMIN' && requester.role !== 'OWNER') {
            set.status = 401;
            return {
                status: "401",
                message: "Apenas ADMIN ou OWNER podem modificar roles"
            };
        }

        // Regras de negócio adicionais
        if (authenticated.userId === userId) {
            set.status = 401;
            return {
                status: "401",
                message: "Não é possível modificar seu próprio role"
            };
        }

        // Apenas OWNER pode promover para OWNER
        if (role === 'OWNER' && requester.role !== 'OWNER') {
            set.status = 401;
            return {
                status: "401",
                message: "Apenas OWNER pode promover outro usuário para OWNER"
            };
        }

        // Verifica se está tentando modificar um OWNER sendo apenas ADMIN
        const targetMember = await TeamRepository.getMember(userId, teamId);
        if (targetMember?.role === 'OWNER' && requester.role === 'ADMIN') {
            set.status = 401;
            return {
                status: "401",
                message: "ADMIN não pode modificar role de OWNER"
            };
        }

        // Chama o usecase
        const userUpdated = await modifyMemberRole(userId, teamId, role);

        set.status = 200;
        return {
            status: "200",
            data: userUpdated
        };

    } catch (error) {
        console.error('Erro na rota PUT /team/:teamId/:userId:', error);

        if (error instanceof UnauthorizedError) {
            set.status = 401;
            return {
                status: "401",
                message: error.message
            };
        }

        // Verifica se é erro conhecido do usecase
        if (error instanceof Error) {
            if (error.message.includes('não encontrado') || error.constructor.name.includes('NotFound')) {
                set.status = 404;
                return {
                    status: "404",
                    message: error.message
                };
            }
        }

        // Erro genérico
        set.status = 500;
        return {
            status: "500",
            message: "Erro interno do servidor"
        };
    }
},{
    body: t.Object({
        role: t.UnionEnum(['OWNER', 'ADMIN', 'MEMBER'])
    }),
    params: t.Object({
        teamId: t.String(),
        userId: t.String()
    }),
    response: {
        200: t.Object({
            status: t.String(),
            data: t.Any()
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
    detail:{
        summary: "Modificar o papel de um membro do time",
        description: "Modifica o papel (role) de um membro específico dentro de um time. Apenas membros com papel de ADMIN ou OWNER podem realizar essa ação.",
        tags: ["Teams"]
    }
})