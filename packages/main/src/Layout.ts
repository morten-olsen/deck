import { ActionApi } from './ActionApi';
import { Button } from "./App/Button";

type PositionArgs<TButton extends Button = Button> = {
  api: ActionApi;
  isRoot: boolean;
  rows: number;
  columns: number;
  stickyButtons: Button[];
  appButtons: (TButton | Button)[];
}

type Layout<TButton extends Button = Button> = {
  position: (args: PositionArgs<TButton>) => (TButton | Button)[];
}

export type {
  PositionArgs,
  Layout,
};
