import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Db, MongoClient } from 'mongodb';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MongoConnectionProvider implements OnModuleInit, OnModuleDestroy {
  private readonly client: MongoClient;
  private database!: Db;

  constructor(private readonly configService: ConfigService) {
    this.client = new MongoClient(
      this.configService.getOrThrow<string>('MONGODB_URL'),
    );
  }

  async onModuleInit(): Promise<void> {
    await this.client.connect();

    this.database = this.client.db(
      this.configService.getOrThrow<string>('MONGODB_DATABASE'),
    );
  }

  getDatabase(): Db {
    return this.database;
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.close();
  }
}
