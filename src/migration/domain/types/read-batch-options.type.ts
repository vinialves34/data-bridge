export type ReadBatchOptions = {
  resource: string;
  batchSize: number;
  cursorField: string;
  cursor?: unknown;
};
