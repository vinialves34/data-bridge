import { Injectable } from '@nestjs/common';
import { DataSource } from '../../../application/ports/data-source.port';
import { DataRecord } from '../../../domain/types/data-record.type';
import { resourceValidate } from '../../../../../shared/utils/validators/resource.validate';
import { PostgresConnectionProvider } from './postgres-connection.provider';

@Injectable()
export class PostgresSourceAdapter implements DataSource {
  constructor(
    private readonly connectionProvider: PostgresConnectionProvider,
  ) {}

  async readBatch(resource: string): Promise<DataRecord[]> {
    const resourceIsValid = resourceValidate(resource);

    if (!resourceIsValid) {
      throw new Error('The specified resource is not valid.');
    }

    const pool = this.connectionProvider.getPool();

    const { rows } = await pool.query<DataRecord>(`SELECT * FROM ${resource};`);

    return rows;
  }
}
