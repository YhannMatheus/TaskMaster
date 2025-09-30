import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { AppRoutes } from "./app.routes";
import { env } from "@/core/env";
// note: avoid strict Server typing to prevent null/variant type issues

// Create Elysia app and attach middlewares/routes before listening
const elysia = new Elysia({
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
      port: env.PORT,
    };
  });

if (env.NODE_ENV === "development") {
  elysia.use(
    swagger({
      swaggerOptions: {
        deepLinking: true,
        withCredentials: true,
      },
      documentation: {
        components: {
          securitySchemes: {
            cookieAuth: {
              type: "apiKey",
              in: "cookie",
              name: "token",
            },
          },
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

// Start listening and expose the underlying Node server instance for tests
const listener = elysia.listen(env.PORT);

// Export the raw server instance (may be null in rare cases) — tests will accept this
export const app = listener.server as any;

console.log(
  `  📋 TaskMaster API \n\n  ⏳ Time: ${new Date().toISOString()} \n\n  🚀 Environment: ${env.NODE_ENV} \n\n  🚪 Port: ${env.PORT} \n\n  🌐 URL: http://localhost:${env.PORT} \n\n  📚 Documentation: http://localhost:${env.PORT}/docs \n\n  © ${new Date().getFullYear()} TaskMaster. All rights reserved.\n\n  `
);
