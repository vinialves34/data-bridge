import { ConfigService as NestConfigService } from '@nestjs/config';
import { Environment } from './env.validation';

export type TypedConfigService = Omit<
  NestConfigService<Environment, true>,
  'get' | 'getOrThrow'
> & {
  get<T extends keyof Environment>(key: T): Environment[T];
  getOrThrow<T extends keyof Environment>(key: T): Environment[T];
};
