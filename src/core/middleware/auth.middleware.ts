import { Context } from 'elysia';
import { AuthService } from '@/core/services/auth.service';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';

interface AuthenticatedContext extends Context {
    user?: {
        userId: string;
        email: string;
        role: 'USER' | 'SUPPORT';
    };
}

export const authMiddleware = async (context: Context) => {
    const { cookie, set } = context;
    
    // Captura o token do cookie
    const token = cookie.auth_token?.value;
    
    if (!token) {
        set.status = 401;
        throw new UnauthorizedError();
    }
    
    try {
        // Verifica e decodifica o token
        const decoded = AuthService.verifyToken(token);
        
        if (!decoded) {
            set.status = 401;
            throw new UnauthorizedError();
        }
        
        // Adiciona os dados do usuário ao contexto
        (context as AuthenticatedContext).user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role
        };
        
        return context;
    } catch (error) {
        set.status = 401;
        throw new UnauthorizedError();
    }
};

// Helper para criar middleware opcional (não bloqueia se não houver token)
export const optionalAuthMiddleware = async (context: Context) => {
    const { cookie } = context;
    
    const token = cookie.auth_token?.value;
    
    if (token) {
        try {
            const decoded = AuthService.verifyToken(token);
            if (decoded) {
                (context as AuthenticatedContext).user = {
                    userId: decoded.userId,
                    email: decoded.email,
                    role: decoded.role
                };
            }
        } catch (error) {
            // Em caso de erro, apenas não autentica (não bloqueia a rota)
            console.warn('Token inválido no middleware opcional:', error);
        }
    }
    
    return context;
};

// Tipos para usar nas rotas
export type { AuthenticatedContext };