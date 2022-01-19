import Emitter from 'eventemitter3';
import { ActionApi } from '../ActionApi';

type Color = [number, number, number];
type Events = {
  update: (button: Button) => void;
}

type Args = {
  background?: Color;
  action?: Action;
  image?: Buffer | Promise<Buffer>;
}

type Action = (context: ActionApi) => void;

class Button extends Emitter<Events> {
  #action?: Action;
  #background?: Color;
  #image?: Buffer | Promise<Buffer>;

  constructor({
    background,
    action,
    image,
  }: Args) {
    super();
    this.#action = action;
    this.#background = background;
    this.#image = image;
  }

  public get action() {
    return this.#action;
  }

  public set action(value: Action | undefined) {
    this.#action = value;
    this.emit('update', this);
  }

  public get background() {
    return this.#background;
  }

  public set background(value: [number, number, number] | undefined) {
    this.#background = value;
    this.emit('update', this);
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
