import { Elysia } from 'elysia';
import { AuthService } from '@/core/services/auth.service';

interface AuthenticatedUser {
    userId: string;
    email: string;
    role: 'USER' | 'SUPPORT';
}

// Plugin de autenticação
export const authMiddleware = new Elysia({ name: 'auth' })
    .onStart(() => {
        console.log('Auth middleware started');
    })
    .onBeforeHandle(async ({ cookie, headers, store, request }) => {
        console.log('🔐 Auth middleware onBeforeHandle called for:', request.method, request.url);
        
        // Captura o token do cookie ou do header Authorization
        let token = cookie.access_token?.value;
        
        // Se não tem no cookie, verifica no header Authorization
        if (!token) {
            const authHeader = headers.authorization;
            console.log('🔍 Auth header:', authHeader);
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7); // Remove 'Bearer ' do token
                console.log('🎫 Token extracted from header:', token?.substring(0, 20) + '...');
            }
        }
        
        if (!token) {
            console.log('❌ No token found in middleware');
            (store as any).authenticated = null;
            return;
        }
        
        try {
            // Verifica e decodifica o token
            const decoded = AuthService.verifyToken(token);
            
            console.log('🔓 Decoded token data:', decoded);
            
            if (!decoded) {
                console.log('❌ Token verification failed - decoded is null');
                (store as any).authenticated = null;
                return;
            }
            
            (store as any).authenticated = {
                userId: decoded.userId,
                email: decoded.email,
                role: decoded.role || 'USER'
            };
            
            console.log('✅ User stored in context:', (store as any).authenticated);
            
        } catch (error) {
            console.log('❌ Token verification error:', error);
            (store as any).authenticated = null;
        }
    });

export type { AuthenticatedUser };
