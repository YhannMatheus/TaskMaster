import { env } from '@/core/env';
import request from 'supertest';
import '@/server';

//! TESTE DE REGISTRO DE USUÁRIO
describe('Teste de rotas de usuário', () => {
    const uniqueEmail = `test.user.${Date.now()}@example.com`;

    it("Deve registrar um novo usuário", async () => {

        const user: any = {
            firstName: "Test",
            lastName: "User",
            email: uniqueEmail,
            password: "Password123!"
        };
        // confirmationPassword is required by the register schema
        user['confirmationPassword'] = user.password;
        const response = await request(`http://localhost:${env.PORT}`)
            .post('/api/users/register')
            .send(user);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('token');
    });

    it("Deve retornar erro ao registrar com email já usado", async () => {
        const user: any = {
            firstName: "Test",
            lastName: "User",
            email: uniqueEmail,
            password: "Password123!"
        };
        
        user['confirmationPassword'] = user.password;
        
        const response = await request(`http://localhost:${env.PORT}`)
            .post('/api/users/register')
            .send(user);
        expect(response.status).toBe(409);
        expect(response.body).toHaveProperty('error', 'Email já está em uso.');
    });

    it("Deve abrir o perfil do usuário autenticado", async () => {
        const credentials = {
            email: uniqueEmail,
            password: "Password123!",
            rememberMe: true
        };
        const loginResponse = await request(`http://localhost:${env.PORT}`)
            .post('/api/users/login')
            .send(credentials);
        
        expect(loginResponse.status).toBe(200);
        const token = loginResponse.body.token;

        const profileResponse = await request(`http://localhost:${env.PORT}`)
            .get('/api/users/profile')
            .set('Authorization', `Bearer ${token}`);
        expect(profileResponse.status).toBe(200);
        expect(profileResponse.body.user).toHaveProperty('email', credentials.email);
        expect(profileResponse.body.user).not.toHaveProperty('password');
    });
});