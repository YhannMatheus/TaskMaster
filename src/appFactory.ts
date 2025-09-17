import { Elysia } from 'elysia'
import cors from '@elysiajs/cors'
import { env } from './core/env'
import { AppRoutes } from './app.routes'

export function createApp() {
  const app = new Elysia({
    serve: {
      idleTimeout: 255,
      hostname: '0.0.0.0',
    },
  })
    // Load swagger only in non-test environments to avoid importing ESM-only deps during Jest runs
    .use(async (appInstance) => {
      if (process.env.NODE_ENV !== 'test') {
        try {
          const { default: swagger } = await import('@elysiajs/swagger')
          appInstance.use(swagger())
        } catch (e) {
          // Failing to load docs should not break the app in test or limited environments
          console.warn('Could not load swagger plugin:', String(e))
        }
      }
      return appInstance
    })
    .use(
      cors({
        credentials: true,
        allowedHeaders: ['content-type'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
        origin: (request) => {
          const origin = request.headers.get('origin')
          if (!origin) return false
          return true
        },
      })
  )
    .use(AppRoutes)
    .get('/health', () => ({ status: 'ok' }))

  return app
}

export type App = ReturnType<typeof createApp>
