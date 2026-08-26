import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';
import { MongoClient } from 'mongodb';
import { DataBatch } from 'src/migration/domain/types/data-batch.type';
import { PostgresSourceAdapter } from 'src/migration/infrastructure/database/postgres/postgres-source.adapter';
import { MongoDestinationAdapter } from 'src/migration/infrastructure/database/mongodb/mongodb-destination.adapter';

type CustomerRow = {
  id: number;
  name: string;
  email: string;
  birth_date: Date;
  active: boolean;
  created_at: Date;
};

@Injectable()
export class DatabasePlaygroundService {
  constructor(
    private readonly configService: ConfigService,
    private readonly postgresSource: PostgresSourceAdapter,
    private readonly mongoDestination: MongoDestinationAdapter,
  ) {}

  async testPostgresConnection(): Promise<void> {
    const connection = new Client({
      connectionString: this.configService.getOrThrow<string>('POSTGRES_URL'),
    });

    try {
      await connection.connect();

      const result = await connection.query('SELECT NOW()');

      console.log(result.rows);
    } finally {
      await connection.end();
    }
  }

  async testMongoConnection(): Promise<void> {
    const connection = new MongoClient(
      this.configService.getOrThrow<string>('MONGODB_URL'),
    );

    try {
      await connection.connect();

      const result = await connection.db().command({ ping: 1 });

      console.log(result);
    } finally {
      await connection.close();
    }
  }

  async getPostgresCustomers(): Promise<CustomerRow[]> {
    const connection = new Client({
      connectionString: this.configService.getOrThrow<string>('POSTGRES_URL'),
    });

    try {
      await connection.connect();

      const { rows } = await connection.query<CustomerRow>(`
        SELECT
          id,
          name,
          email,
          birth_date,
          active,
          created_at
        FROM customers
        ORDER BY id;
      `);

      return rows;
    } finally {
      await connection.end();
    }
  }

  async getPostgresDataBatch(): Promise<DataBatch> {
    return this.postgresSource.readBatch({
      resource: 'customers',
      cursorField: 'id',
      batchSize: 2,
    });
  }

  async migratePostgresBatchToMongo(): Promise<void> {
    const batch = await this.postgresSource.readBatch({
      resource: 'customers',
      cursorField: 'id',
      batchSize: 2,
    });

    await this.mongoDestination.writeBatch('customers', batch.records);

    console.log({
      migrateRecords: batch.records.length,
      nextCursor: batch.nextCursor,
      hasMore: batch.hasMore,
    });
  }
}
