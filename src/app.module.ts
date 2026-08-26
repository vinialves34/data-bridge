import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabasePlaygroundService } from './database/database-playground.service';
import { PostgresConnectionProvider } from './migration/infrastructure/database/postgres/postgres-connection.provider';
import { PostgresSourceAdapter } from './migration/infrastructure/database/postgres/postgres-source.adapter';
import { validate } from 'shared/config/environment/env.validation';
import { MongoDestinationAdapter } from './migration/infrastructure/database/mongodb/mongodb-destination.adapter';
import { MongoConnectionProvider } from './migration/infrastructure/database/mongodb/mongodb-connection.provider';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
  ],
  providers: [
    PostgresConnectionProvider,
    PostgresSourceAdapter,
    MongoConnectionProvider,
    MongoDestinationAdapter,
    DatabasePlaygroundService,
  ],
})
export class AppModule {}
