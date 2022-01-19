import Emitter from 'eventemitter3';
import { Layout } from '../Layout';
import { BasicLayout } from '../layouts';
import { Button } from './Button';

type Events = {
  update: (button: Button) => void;
  remove: (button: Button) => void;
  add: (button: Button) => void;
  render: () => void;
}

class App<TButton extends Button = Button> extends Emitter<Events> {
  #buttons: TButton[] = [];
  #layout: Layout<TButton> = new BasicLayout<TButton>();

  #update = (button: Button) => {
    this.emit('update', button);
  }

  public get buttons() {
    return [...this.#buttons];
  }

  public get layout() {
    return this.#layout;
  }

  protected set layout(value: Layout<TButton>) {
    this.#layout = value;
    this.emit('render');
  }

  public addButton = (button: TButton) => {
    if (this.#buttons.find(b => b === button)) {
      return;
    }
    this.#buttons.push(button);
    button.on('update', this.#update);
    this.emit('add', button);
  }

  public removeButton = (button: TButton) => {
    if (!this.#buttons.includes(button)) {
      return;
    }
    button.off('update', this.#update);
    this.#buttons = this.#buttons.filter(b => b !== button);
    this.emit('remove', button);
  }

  public onFocus?: () => void;

  public onUnfocus?: () => void;
}

export { Button, App };
