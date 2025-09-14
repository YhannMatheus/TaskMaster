import { Elysia } from 'elysia';
import { AuthService } from '@/core/services/auth.service';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';

interface AuthenticatedUser {
    userId: string;
    email: string;
    role: 'USER' | 'SUPPORT';
}

// Plugin de autenticação que só executa quando 'authenticated' é acessado
export const authMiddleware = new Elysia({ name: 'auth' })
    .derive(({ cookie, set }) => ({
        get authenticated(): Promise<AuthenticatedUser> {
            // Esta função só é executada quando 'authenticated' é acessado na rota
            return (async () => {
                // Captura o token do cookie
                const token = cookie.access_token?.value;
                
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
                    
                    return {
                        userId: decoded.userId,
                        email: decoded.email,
                        role: decoded.role
                    };
                    
                } catch (error) {
                    set.status = 401;
                    throw new UnauthorizedError();
                }
            })();
        }
    }));

export type { AuthenticatedUser };