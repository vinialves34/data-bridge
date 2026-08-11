import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabasePlaygroundService } from './database/database-playground.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [DatabasePlaygroundService],
})
export class AppModule {}
