import { z } from "zod";
import dotenv from "dotenv";

let _envFile = null;

try {
    _envFile = await Bun.file('.env').text();
} catch (err) {
    // ignorar se o arquivo .env não existir no ambiente
    // eslint-disable-next-line no-console
    console.debug('.env not found or unreadable');

}

if (_envFile) {
    const parsed = dotenv.parse(_envFile);
    for (const [k, v] of Object.entries(parsed)) {
        if (process.env[k] === undefined) process.env[k] = String(v);
    }
}

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    
    DATABASE_URL: z.string().min(1),

    APPLICATION_PORT: z.coerce.number().default(3000),
    APPLICATION_HOST: z.string().min(1).default("localhost"),

    JWT_SECRET: z.string().min(1),

    PORT: z.coerce.number().default(3000),
    HOST: z.string().min(1).default("localhost"),

    // Email configuration
    SMTP_HOST: z.string().default("smtp.gmail.com"),
    SMTP_PORT: z.coerce.number().default(587),
    SMTP_SECURE: z.string().default("false"),
    SMTP_USER: z.string().default(""),
    SMTP_PASSWORD: z.string().default(""),
    
    // Frontend URL
    FRONTEND_URL: z.string().default("http://localhost:3000"),

})

export const env = envSchema.parse(process.env);