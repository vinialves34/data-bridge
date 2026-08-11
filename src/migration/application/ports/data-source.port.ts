import { DataRecord } from '../../domain/types/data-record.type';

export interface DataSource {
  readBatch(resource: string): Promise<DataRecord[]>;
}
