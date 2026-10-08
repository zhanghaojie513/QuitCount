import 'dotenv/config';
import { defineConfig } from 'prisma/config';

const localDevelopmentUrl =
  'postgresql://quitcount:quitcount@127.0.0.1:5432/quitcount?schema=public';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL ?? localDevelopmentUrl,
  },
});
