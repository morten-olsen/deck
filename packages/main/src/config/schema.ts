type ConfigSchemaBase<TDefault> = {
  type: string;
  name: string;
  prompt?: string;
  required?: boolean;
  default?: TDefault;
}

type ConfigSchemaString = {
  type: 'string';
  validator?: RegExp;
} & ConfigSchemaBase<string>

type ConfigSchemaSecret = {
  type: 'secret';
} & ConfigSchemaBase<string>

type ConfigSchemaField = ConfigSchemaString | ConfigSchemaSecret;

type ConfigSchema = ConfigSchemaField[];

export type {
  ConfigSchemaString,
  ConfigSchemaField,
  ConfigSchema,
}
