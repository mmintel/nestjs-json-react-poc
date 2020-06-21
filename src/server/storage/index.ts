export * from './file.storage';

export interface Storage {
  getOne: (path: string) => Promise<string>,
  getMany: (path: string) => Promise<string[]>
};
