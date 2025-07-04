import "dotenv/config";
import z from "zod";
import { parseEnv, port } from "znv";

const createConfigFromEnvironment = (environment: NodeJS.ProcessEnv) => {
  const config = parseEnv(environment, {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
    CLERK_SECRET_KEY: z.string(),
    MONGODB_URI: z.string().url(),
    NEXTAUTH_URL: z.string().url(),
    NEXTAUTH_SECRET: z.string(),
    // Add more as needed
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: port().default(3000),
  });
  return {
    ...config,
  };
};

export type Config = ReturnType<typeof createConfigFromEnvironment>;

export const config = createConfigFromEnvironment(process.env);
