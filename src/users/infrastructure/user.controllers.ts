import { UserType } from './../domain/user.type';
import { Elysia, t } from "elysia"
import { userLogin } from './../application/login.usecase';
import { userRegister } from "../application/register.usecase";
import { 
    EmailAlreadyUsedError,
    InvalidCredentialsError, 
    InvalidPasswordFormatError, 
    PasswordDoNotMatchError 
} from '@/core/errors/index.error';
import {
    authMiddleware,
    optionalAuthMiddleware,
    AuthenticatedContext
} from "@/core/middleware/auth.middleware";

export const userRoutes = new Elysia({
    prefix: "/users",
    tags: ["Users"]
})
.post("/auth/login", async ({body, set}) => {
    try{
        
        const userLoginData = await userLogin(body.email, body.password, body.rememberMe || false)
        
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
    }
})

.get("/register", async ({body, set}) => {
    try {
        const user = await userRegister({...body});
        
        set.status = 201;
        
        return { 
            status : 201,
            user : user
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

        if(error instanceof InvalidPasswordFormatError){
            set.status = 400;
            return { error: error.message };
        }

        if(error instanceof EmailAlreadyUsedError){
            set.status = 409;
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
    })
})