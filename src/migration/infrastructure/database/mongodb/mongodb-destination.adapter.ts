import { DataDestination } from 'src/migration/application/ports/data-destination.port';
import { MongoConnectionProvider } from './mongodb-connection.provider';
import { DataRecord } from 'src/migration/domain/types/data-record.type';
import { validateDbIdentifiers } from 'shared/utils/validators/db-identifiers.validate';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MongoDestinationAdapter implements DataDestination {
  constructor(private readonly connectionProvider: MongoConnectionProvider) {}

  async writeBatch(resource: string, records: DataRecord[]): Promise<void> {
    const dbIdentifiersIsValid = validateDbIdentifiers([resource]);

    if (!dbIdentifiersIsValid) {
      throw new Error('The destination resource name is invalid.');
    }

    if (!records.length) {
      return;
    }

    const database = this.connectionProvider.getDatabase();
    const collection = database.collection<DataRecord>(resource);

    await collection.insertMany(records);
  }
}
