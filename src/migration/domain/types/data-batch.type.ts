import { DataRecord } from './data-record.type';

export type DataBatch = {
  records: DataRecord[];
  nextCursor?: unknown;
  hasMore: boolean;
};
