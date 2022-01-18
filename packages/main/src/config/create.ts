import inquirer from 'inquirer';
import { ConfigSchema } from './schema';

const createConfig = async (schema: ConfigSchema) => {
  const questions = schema.map((field) => {
    switch (field.type) {
      case 'string':
        return {
          type: 'input',
          name: field.name,
          message: field.prompt || field.name,
          default: field.default,
          validate: (input: string) => {
            if (field.validator && !field.validator.test(input)) {
              return `invalid, should be ${field.validator}`;
            }
            if (!input && field.required) {
              return `${field.name} is required`
            }
            return true
          }
        }
      case 'secret':
        return {
          type: 'password',
          name: field.name,
          message: field.prompt || field.name,
          default: field.default,
          validate: (input: string) => {
            if (!input && field.required) {
              return `${field.name} is required`
            }
            return true
          }
        };
    }
  });

  const answers = await inquirer.prompt(questions);
  return answers;
}

export {
  createConfig,
}
