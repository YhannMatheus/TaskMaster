const { Client } = require('pg')
;(async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL })
  try {
    await client.connect()
    const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")
    console.log(res.rows)
  } catch (e) {
    console.error(e)
    process.exit(1)
  } finally {
    await client.end()
  }
})()
