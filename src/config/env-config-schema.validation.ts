import * as zod from "zod";

export const envValidationSchema = zod.object({
  PORT: zod.string().nonempty(),
  GROQ_API_KEY: zod.string().describe("groq ai api-key").nonempty(),
  GROQ_CHAT_MODEL: zod.string().nonempty(),
  DATABASE_HOST: zod.string().nonempty(),
  DATABASE_PORT: zod.string().nonempty(),
  DATABASE_SYNCHRONIZE: zod.string().default('true'),
//   DATABASE_LOGGING: zod.boolean().default(false),
  DATABASE_NAME: zod.string().nonempty(),
  DATABASE_USERNAME: zod.string().nonempty(),
  DATABASE_PASSWORD: zod.string().nonempty(),
});

export type Env = zod.infer<typeof envValidationSchema>;

export function validateEnv(env: NodeJS.ProcessEnv): Env {
  const parsed = envValidationSchema.safeParse(env);

  if (!parsed.success) {
    console.error("❌ Invalid environment variables:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
  }

  return parsed.data;
}
