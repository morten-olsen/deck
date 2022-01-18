interface ConfigSchemaBase<TDefault = any> {
  type: string;
  name: string;
  prompt?: string;
  required?: boolean;
  default?: TDefault;
}

interface ConfigSchemaString extends ConfigSchemaBase<string> {
  type: 'string';
  validator?: RegExp;
}

interface ConfigSchemaSecret extends ConfigSchemaBase<string> {
  type: 'secret';
}

type ConfigSchemaField = ConfigSchemaString | ConfigSchemaSecret;

type ConfigSchema = ConfigSchemaField[];

export type {
  ConfigSchemaString,
  ConfigSchemaField,
  ConfigSchema,
}
