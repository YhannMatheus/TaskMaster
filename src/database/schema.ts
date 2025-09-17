import "dotenv/config"
import { defineConfig } from "drizzle-kit"

const config = {
    url: process.env.DATABASE_URL,
    dialect: "postgresql",
    schema: "./src/database/index.schema.ts",
    out: "./migrations",
} as any

export default defineConfig(config)