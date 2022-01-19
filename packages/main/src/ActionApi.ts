import { App } from './App';

type ActionApi = {
  update: () => void;
  open: (app: App) => void;
  back: () => void;
  popTo: (app: App) => void;
  updateStack: (updateFunction: (apps: App[]) => App[]) => void;
}

export type { ActionApi };
