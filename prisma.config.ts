// Attempt to load dotenv if available, but don't fail if it's missing
try {
  // Use require to avoid top-level dynamic import issues when running Prisma CLI
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require("dotenv/config");
} catch (e) {
  // noop - dotenv is optional for certain CLI invocations
}

// Try to import prisma/config; if unavailable (e.g. when Prisma package isn't
// installed in the environment where the CLI is invoked), provide minimal
// fallbacks so the config file can still be loaded for schema-only commands.
let defineConfig: (c: any) => any;
let env: (k: string) => string | undefined;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const prismaConfig = require("prisma/config");
  defineConfig = prismaConfig.defineConfig;
  env = prismaConfig.env;
} catch (e) {
  // Fallback implementations
  defineConfig = (c: any) => c;
  env = (k: string) => process.env[k];
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
