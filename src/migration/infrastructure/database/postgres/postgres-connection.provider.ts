import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Injectable()
export class PostgresConnectionProvider implements OnModuleDestroy {
  private readonly pool: Pool;

  constructor(private readonly configService: ConfigService) {
    this.pool = new Pool({
      connectionString: this.configService.getOrThrow<string>('POSTGRES_URL'),
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  }

  getPool(): Pool {
    return this.pool;
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }
}
