require('dotenv').config()
const { createApp } = require('../src/appFactory')
;(async ()=>{
  const app = createApp()
  const testUser = {
    firstName: 'Test',
    lastName: 'User',
    email: `test_debug@example.com`,
    password: 'P@ssw0rd!',
    confirmationPassword: 'P@ssw0rd!',
    instituition: 'NENHUMA'
  }
  const req = new Request('http://localhost/taskmaster/api/v1/users/register', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(testUser) })
  const res = await app.handle(req)
  console.log('Status:', res.status)
  try { console.log(await res.json()) } catch(e){ console.log('No json body') }
})()
