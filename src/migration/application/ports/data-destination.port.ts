import { DataRecord } from '../../domain/types/data-record.type';

export interface DataDestination {
  writeBatch(resource: string, records: DataRecord[]): Promise<void>;
}
