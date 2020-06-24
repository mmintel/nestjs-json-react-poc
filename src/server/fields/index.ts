export * from './field';

import { TextField } from './text';
import { RelationField } from './relation';

export const fields = [
  new TextField(),
  new RelationField(),
]