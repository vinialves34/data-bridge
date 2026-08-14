import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabasePlaygroundService } from './database/database-playground.service';
import { PostgresConnectionProvider } from './migration/infrastructure/database/postgres/postgres-connection.provider';
import { PostgresSourceAdapter } from './migration/infrastructure/database/postgres/postgres-source.adapter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [
    PostgresConnectionProvider,
    PostgresSourceAdapter,
    DatabasePlaygroundService,
  ],
})
export class AppModule {}
