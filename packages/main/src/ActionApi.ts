import { App } from './App';

type ActionApi = {
  update: () => void;
  open: (app: App) => void;
  back: () => void;
}

export type { ActionApi };
