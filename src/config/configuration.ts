import { readFileSync } from 'fs';
import yaml from 'js-yaml';
import path from 'path';

const YAML_CONFIG_FILENAME = 'config.yaml';

export default () => {
  const filePath = path.join(__dirname, '/../../', YAML_CONFIG_FILENAME);
  return yaml.load(readFileSync(filePath, 'utf8')) as Record<string, any>;
};
