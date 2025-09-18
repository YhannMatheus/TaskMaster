import { cookie } from './../../../node_modules/@elysiajs/cookie/src/index';
import {Elysia, InternalServerError, t} from 'elysia'
import { TeamRepository } from "./team.repositori";
import { TeamType } from '../domain/team.type';
import {
    UnauthorizedError
} from "@/core/errors/index.error"
import { authMiddleware, AuthenticatedUser } from '@/core/middleware/auth.middleware';
import { createTeam } from '../application/create-team.usecase';

export const TeamRoutes = new Elysia({
    prefix: '/teams',
    tags: ['Teams']
})
.use(authMiddleware)

.post('/team', async(context: any) => {
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

.delete('/team/:teamId', async(context: any) => {
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