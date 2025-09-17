import { createApp } from '../src/appFactory'
// use global fetch (Node >=18) available in the test environment

let app: any

declare const beforeAll: any
declare const afterAll: any
declare const describe: any
declare const test: any
declare const expect: any

beforeAll(async () => {
  app = createApp()
})

describe('Auth routes', () => {
  const testUser = {
    firstName: 'Test',
    lastName: 'User',
    email: `testuser_${Date.now()}@example.com`,
    password: 'P@ssw0rd!',
    confirmationPassword: 'P@ssw0rd!',
    instituition: 'NENHUMA'
  }

  test('Register then Login', async () => {
    // Register using in-process handler
    const regReq = new Request(`http://localhost/taskmaster/api/v1/users/register`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(testUser)
    })
    const regRes = await app.handle(regReq)

    if (regRes.status !== 201) {
      const bodyFail = await regRes.text()
      console.error('Register failed body:', bodyFail)
    }
    expect(regRes.status).toBe(201)
    const regBody: any = await regRes.json()
    expect(regBody).toHaveProperty('user')
    expect(regBody.user).toHaveProperty('email', testUser.email)

    // Login using in-process handler
    const loginReq = new Request(`http://localhost/taskmaster/api/v1/users/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: testUser.email, password: testUser.password })
    })
    const loginRes = await app.handle(loginReq)

    expect(loginRes.status).toBe(200)
  const loginBody: any = await loginRes.json()
    expect(loginBody).toHaveProperty('token')
    expect(loginBody).toHaveProperty('user')
    expect(loginBody.user).toHaveProperty('email', testUser.email)
  }, 20000)
})
