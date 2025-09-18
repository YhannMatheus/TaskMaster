import { UserType, UserProfileResponseType } from './../domain/user.type';
import { Elysia, t } from "elysia"
import { cookie } from '@elysiajs/cookie'
import { userLogin } from './../application/login.usecase';
import { userRegister } from "../application/register.usecase";
import { 
    EmailAlreadyUsedError,
    InvalidCredentialsError, 
    InvalidPasswordFormatError, 
    PasswordDoNotMatchError, 
    UnauthorizedError
} from '@/core/errors/index.error';
import { userProfile } from '../application/profile.usecase';
import { authMiddleware, AuthenticatedUser } from '@/core/middleware/auth.middleware';
import { env } from '@/core/env';

//TODO: Inicio dos controllers de usuário
export const userRoutes = new Elysia({
    prefix: "/users",
    tags: ["Users"]
})
.use(authMiddleware)
.use(cookie())
.post("/auth/login", async ({body, set, cookie}) => {
    try{
        
        const userLoginData = await userLogin(body.email, body.password, body.rememberMe || false)
        
        cookie.access_token.set({
            value: userLoginData.token,
            httpOnly: true,
            secure: (env.NODE_ENV === "production") ? true : false,
            sameSite: 'lax',
            maxAge: body.rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24,
            path: '/'
        });
        
        set.status = 200;
        return {
            token: userLoginData.token,
            user: { ... userLoginData.userReturn}
        }

    }catch(error){
        if (error instanceof InvalidCredentialsError) {
            set.status = 401;
            return { error: error.message };
        }
        
        set.status = 500;
        return { error: 'Erro interno do servidor' };
    }

},{
    body : t.Object({
        email: t.String(),
        password: t.String(),
        rememberMe: t.Optional(t.Boolean())
    }),
    response : {
        200: t.Object({
            token: t.String(),
            user: t.Omit(UserType, ['password']),
        }),
        401: t.Object({
            error: t.String()
        }),
        500: t.Object({
            error: t.String()
        })
    },
    detail: {
        summary: "Login do usuário",
        description: "Realiza o login do usuário e retorna um token de autenticação.",
        tags: ["Users"]
    }
})

.post("/register", async ({body, set, cookie}) => {
    try {
        const { user , token} = await userRegister({ ...body });

        cookie.access_token.set({
            value: token,
            httpOnly: true,
            secure: (env.NODE_ENV === "production") ? true : false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60,
            path: '/'
        });
        
        set.status = 201;

        return {
            status: 201,
            user: { ...user },
        };

    } catch (error) {
        if( error instanceof InvalidPasswordFormatError) {
            set.status = 400;
            return { error: error.message };
        }

        if(error instanceof EmailAlreadyUsedError){
            set.status = 409;
            return { error: error.message };
        }

        if(error instanceof PasswordDoNotMatchError){
            set.status = 401;
            return { error: error.message };
        }

        set.status = 500;
        return { error: 'Erro interno do servidor' };
    }
},{
    body : t.Object({
        firstName: t.String(),
        lastName: t.Optional(t.String()),
        email: t.String(),
        password: t.String(),
        confirmationPassword: t.String(),
        instituition: t.Optional(t.UnionEnum(["UFPA", "UEPA", "IFPA", "CESUPA", "UNAMA", "FIBRA", "ESTACIO", "OUTRO", "NENHUMA"])),
        role: t.Optional(t.UnionEnum(["USER", "SUPPORT"]))
    }),
    response : {
        201: t.Object({
            status: t.Number(),
            user: t.Omit(UserType, ['password']),
            token: t.String()
        }),
        400: t.Object({
            error: t.String()
        }),
        401: t.Object({
            error: t.String()
        }),
        409: t.Object({
            error: t.String()
        }),
        500: t.Object({
            error: t.String()
        })
    },
    detail:{
        summary: "Registrar novo usuário",
        description: "Registra um novo usuário no sistema. Retorna os dados do usuário criado, excluindo a senha.",
        tags: ["Users"]
    }
})

.get("/me", async (context: any) => {
    
    const user = await context.authenticated;

    if(user){
        try {
           
            const profile = await userProfile(user.userId);
             
            if (!profile) {
                context.set.status = 404;
                return {
                    status: "404",
                    error: "User not found"
                };
            }
            
            context.set.status = 200;
            return { user: profile };
            
        } catch (error) {
            if (error instanceof UnauthorizedError) {
                context.set.status = 401;
                return {
                    status: "401",
                    error: "Unauthorized"
                };
            }
            
            context.set.status = 500;
            return {
                status: "500",
                error: "Internal server error"
            };
        }
    } else {
        context.set.status = 401;
        return {
            status: "401", 
            error: "Unauthorized" 
        };
    }
}, {
    response: {
        200: t.Object({
            user: t.Object({
                id: t.String(),
                firstName: t.String(),
                lastName: t.Union([t.String(), t.Null()]),
                email: t.String(),
                role: t.Union([t.Literal('USER'), t.Literal('SUPPORT')]),
                instituition: t.Union([
                    t.Literal('UFPA'),
                    t.Literal('UEPA'),
                    t.Literal('IFPA'),
                    t.Literal('CESUPA'),
                    t.Literal('UNAMA'),
                    t.Literal('FIBRA'),
                    t.Literal('ESTACIO'),
                    t.Literal('OUTRO'),
                    t.Literal('NENHUMA'),
                    t.Null()
                ]),
                createdAt: t.Union([t.Date(), t.Null()]),
                updatedAt: t.Union([t.Date(), t.Null()]),
                teams: t.Array(t.Object({
                    id: t.String(),
                    name: t.String(),
                    description: t.Union([t.String(), t.Null()]),
                    role: t.Union([t.Literal('OWNER'), t.Literal('ADMIN'), t.Literal('MEMBER')]),
                    joinedAt: t.Date()
                }))
            })
        }),
        401: t.Object({
            status: t.String(),
            error: t.String()
        }),
        404: t.Object({
            status: t.String(),
            error: t.String()
        }),
        500: t.Object({
            code: t.String(),
            error: t.String()
        })
    },
    detail: {
        summary: "Obter perfil do usuário",
        description: "Retorna o perfil completo do usuário autenticado incluindo seus teams",
        tags: ["Users"],
        security: [{ bearerAuth: [] }]
    }
})