import { Injectable } from '@nestjs/common';
import { DataSource } from '../../../application/ports/data-source.port';
import { DataRecord } from '../../../domain/types/data-record.type';
import { ReadBatchOptions } from '../../../domain/types/read-batch-options.type';
import { validateDbIdentifiers } from '../../../../../shared/utils/validators/db-identifiers.validate';
import { PostgresConnectionProvider } from './postgres-connection.provider';
import { DataBatch } from 'src/migration/domain/types/data-batch.type';

@Injectable()
export class PostgresSourceAdapter implements DataSource {
  constructor(
    private readonly connectionProvider: PostgresConnectionProvider,
  ) {}

  async readBatch(options: ReadBatchOptions): Promise<DataBatch> {
    const { resource, batchSize, cursorField, cursor } = options;

    const dbIdentifiersIsValid = validateDbIdentifiers([resource, cursorField]);

    if (!dbIdentifiersIsValid) {
      throw new Error('There are invalid database indicators.');
    }

    if (!Number.isInteger(batchSize) || batchSize <= 0) {
      throw new Error('Batch size must be a positive integer.');
    }

    const pool = this.connectionProvider.getPool();

    const queryLimit = batchSize + 1;
    const hasCursor = cursor !== undefined;

    const query = hasCursor
      ? {
          text: `SELECT * FROM ${resource} WHERE ${cursorField} > $1 ORDER BY ${cursorField} LIMIT $2;`,
          values: [cursor, queryLimit],
        }
      : {
          text: `SELECT * FROM ${resource} ORDER BY ${cursorField} LIMIT $1;`,
          values: [queryLimit],
        };

    const { rows } = await pool.query<DataRecord>(query);

    const hasMore = rows.length > batchSize;
    const records = hasMore ? rows.slice(0, batchSize) : rows;
    const lastRecord = records.at(-1);
    const nextCursor = lastRecord ? lastRecord[cursorField] : undefined;

    return {
      records,
      nextCursor,
      hasMore,
    };
  }
}
