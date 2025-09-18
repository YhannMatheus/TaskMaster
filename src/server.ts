import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { AppRoutes } from "./app.routes";
import { env } from "@/core/env";

const app = new Elysia({
  serve: {
    idleTimeout: 255,
    hostname: "0.0.0.0",
  },
})
  .use(
    cors({
      credentials: true,
      allowedHeaders: ["content-type"],
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
      origin: (request): boolean => {
        const origin = request.headers.get("origin");

        if (!origin) {
          return false;
        }

        return true;
      },
    })
  )
  .use(AppRoutes)
  .get("/health", () => {
    return {
      status: "success",
      message: "TaskMaster API is running",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: env.NODE_ENV,
      port: env.PORT
    }
  })
  .listen(env.PORT);

if (env.NODE_ENV === "development") {
  app.use(
    swagger({
      swaggerOptions: {
        deepLinking: true,
        withCredentials: true,
      },
      documentation: {
        components: {
          securitySchemes: {
            cookieAuth: {
              type: 'apiKey',
              in: 'cookie',
              name: 'token'
            }
          }
        },
        security: [{ cookieAuth: [] }],
        servers: [
          {
            url: `http://localhost:${env.PORT}`,
            description: "Development Server",
          },
          {
            url: "https://api.taskmaster.com",
            description: "Production",
          },
        ],
        info: {
          title: "TaskMaster API",
          version: "1.0.0",
          description: `TaskMaster Task Management API - © ${new Date().getFullYear()}. All rights reserved.`,
        },
      },
      path: "/docs",
    })
  );
}

export type app = typeof app;

console.log(
  `  📋 TaskMaster API \n
  ⏳ Time: ${new Date().toISOString()} \n
  🚀 Environment: ${env.NODE_ENV} \n
  🚪 Port: ${app.server?.port} \n
  🌐 URL: http://localhost:${app.server?.port} \n
  📚 Documentation: http://localhost:${app.server?.port}/docs \n
  © ${new Date().getFullYear()} TaskMaster. All rights reserved.
  \n
  `
);
