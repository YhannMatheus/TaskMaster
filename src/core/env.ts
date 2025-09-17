import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    
    DATABASE_URL: z.string().min(1),

    APPLICATION_PORT: z.coerce.number().default(3000),
    APPLICATION_HOST: z.string().min(1).default("localhost"),

    JWT_SECRET: z.string().min(1),

    PORT: z.coerce.number().default(3000),
    HOST: z.string().min(1).default("localhost"),

})

export const env = envSchema.parse(process.env);