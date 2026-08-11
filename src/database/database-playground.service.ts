import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';
import { MongoClient } from 'mongodb';

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
  constructor(private configService: ConfigService) {}

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
}
