import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnApplicationShutdown
{
  constructor(config: ConfigService) {
    const connectionString = config.getOrThrow<string>('database.url');
    const adapter = new PrismaPg({
      connectionString,
      max: config.get<number>('database.poolMax', 10),
      connectionTimeoutMillis: config.get<number>(
        'database.connectTimeoutMs',
        3000,
      ),
      idleTimeoutMillis: 10000,
    });
    super({ adapter });
  }

  async ping(): Promise<void> {
    await this.$queryRaw`SELECT 1`;
  }

  async onApplicationShutdown(): Promise<void> {
    await this.$disconnect();
  }
}
