import path from 'path';
import fs from 'fs-extra';
import envPaths from 'env-paths';
import { createConfig } from './create';
import { ConfigSchema } from './schema';

const paths = envPaths('deckjs');
const appConfigLocation = path.join(paths.config, 'apps');

export const getConfig = async <TConfig = any>(appName: string, schema: ConfigSchema) => {
  const configLoction = path.join(appConfigLocation, `${appName}.json`);
  if (!fs.existsSync(appConfigLocation)) {
    await fs.mkdirp(appConfigLocation);
  }
  if (!fs.existsSync(configLoction)) {
    const fallback = await createConfig(schema) as TConfig;
    await fs.writeFile(configLoction, JSON.stringify(fallback, null, '  '), 'utf-8');
  }
  const config = await fs.readJson(configLoction) as TConfig;
  return config;
};
