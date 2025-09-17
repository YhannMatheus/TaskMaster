import { createApp } from './appFactory'
import { env } from './core/env'

const packageJson = JSON.parse(await Bun.file('./package.json').text())

const app = createApp()

app.listen(env.PORT)

export type app = typeof app

console.log(`Server started on port ${env.PORT} - version ${packageJson.version}`)
