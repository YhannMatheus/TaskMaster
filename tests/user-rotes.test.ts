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
            .post('/users/auth/register')
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
            .post('/users/auth/register')
            .send(user);
        expect(response.status).toBe(409);
        expect(response.body).toHaveProperty('error', 'Email já está em uso.');
    });

    it("Login para um usuário existente", async () => {
        const credentials = {
            email: uniqueEmail,
            password: "Password123!"
        };
        const response = await request(`http://localhost:${env.PORT}`)
            .post('/users/auth/login')
            .send(credentials);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('user');
        expect(response.body.user).not.toHaveProperty('password');
        expect(response.body.user).toHaveProperty('email', credentials.email);
    });
});