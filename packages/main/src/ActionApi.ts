import { App } from './App';

interface ActionApi {
  update: () => void;
  open: (app: App) => void;
  back: () => void;
}

export type { ActionApi };
