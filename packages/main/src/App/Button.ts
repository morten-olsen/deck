import Emitter from 'eventemitter3';
import { ActionApi } from '../ActionApi';

type Color = [number, number, number];
type Events = {
  update: (button: Button) => void;
}

type Args = {
  action?: Action;
  image?: Buffer | Promise<Buffer>;
}

type Action = (context: ActionApi) => void;

class Button extends Emitter<Events> {
  #action?: Action;
  #image?: Buffer | Promise<Buffer>;

  constructor({
    action,
    image,
  }: Args) {
    super();
    this.#action = action;
    this.#image = image;
  }

  public get action() {
    return this.#action;
  }

  public set action(value: Action | undefined) {
    this.#action = value;
  }

  public get image() {
    return this.#image;
  }

  public set image(value: Buffer | Promise<Buffer> | undefined) {
    this.#image = value;
    this.emit('update', this);
  }
}

export { Button };
