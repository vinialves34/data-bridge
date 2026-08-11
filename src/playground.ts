import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DatabasePlaygroundService } from './database/database-playground.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const databasePlayground = app.get(DatabasePlaygroundService);

    const customers = await databasePlayground.getPostgresCustomers();

    console.table(customers);
  } finally {
    await app.close();
  }
}

bootstrap();
