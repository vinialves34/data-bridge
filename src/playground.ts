import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DatabasePlaygroundService } from './database/database-playground.service';
import { ConfigService } from '@nestjs/config';
import { TypedConfigService } from 'shared/config/environment/env.types';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const configService = app.get<TypedConfigService>(ConfigService);

  try {
    const databasePlayground = app.get(DatabasePlaygroundService);

    await postgresPlayground(
      configService.getOrThrow('POSTGRES_PLAYGROUND'),
      databasePlayground,
    );

    await mongodbPlayground(
      configService.getOrThrow('MONGODB_PLAYGROUND'),
      databasePlayground,
    );
  } finally {
    await app.close();
  }
}

async function postgresPlayground(
  isEnabled: boolean,
  dbPlayground: DatabasePlaygroundService,
) {
  if (isEnabled) {
    const customers = await dbPlayground.getPostgresCustomers();
    const batch = await dbPlayground.getPostgresDataBatch();

    console.table(customers);
    console.log(batch);
  }
}

async function mongodbPlayground(
  isEnabled: boolean,
  dbPlayground: DatabasePlaygroundService,
) {
  if (isEnabled) {
    await dbPlayground.migratePostgresBatchToMongo();
  }
}

bootstrap();
