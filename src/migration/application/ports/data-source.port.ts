import { ReadBatchOptions } from '../../domain/types/read-batch-options.type';
import { DataBatch } from '../../domain/types/data-batch.type';

export interface DataSource {
  readBatch(options: ReadBatchOptions): Promise<DataBatch>;
}
