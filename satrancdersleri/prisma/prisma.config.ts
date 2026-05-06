import path from 'node:path'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: path.join(process.cwd(), 'prisma/schema.prisma'),
  datasource: {
    url:
      process.env.POSTGRES_URL_NON_POOLING ||
      process.env.DATABASE_URL_UNPOOLED ||
      process.env.DATABASE_URL!,
  },
})
