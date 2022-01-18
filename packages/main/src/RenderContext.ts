import { StreamDeck } from "elgato-stream-deck";
import sharp from 'sharp';
import { Button } from "./App";

const debounce = <TArgs extends any[]>(fn: (...args: TArgs) => any, timeout = 300) => {
  let timer: NodeJS.Timeout | undefined;
  return (...args: TArgs) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => { fn.apply(this, args); }, timeout);
  };
}

interface ButtonPosition {
  subscription: any;
  button: Button;
}

class RenderContext {
  #deck: StreamDeck;
  #buttons: (ButtonPosition | undefined)[] = [];

  constructor(deck: StreamDeck) {
    this.#deck = deck;
    deck.clearAllKeys();
  }

  #renderButton = (i: number) => {
    const { button: current } = this.#buttons[i] || {};
    if (current?.image) {
      const run = async () => {
        const image = await current.image!;
        const adjusted = sharp(image)
          .flatten()
          .resize(this.#deck.ICON_SIZE, this.#deck.ICON_SIZE)
          .raw()
          .toBuffer()
        const final = await adjusted;
        this.#deck.fillImage(i, final);
      };
      run();
    } else if (current?.background) {
      this.#deck.fillColor(i, ...current.background);
    } else {
      this.#deck.clearKey(i)
    }
  }

  #setupButton = (current: Button | undefined, i: number) => {
    if (this.#buttons[i] === current) {
      return;
    }
    this.#buttons[i]?.button.off('update', this.#buttons[i]?.subscription);
    const subscription = () => {
      this.#renderButton(i);
    }
    if (current) {
      current.on('update', subscription);
    }
    const value = current ? {
      button: current,
      subscription,
    } : undefined;
    this.#buttons[i] = value;
    this.#renderButton(i);
  }

  public render = debounce((buttons: Button[]) => {
    for (let i = 0; i < this.#deck.NUM_KEYS; i++) {
      const current = buttons[i];
      this.#setupButton(current, i);
    } 
  }, 30);

  public get = (index: number) => {
    return this.#buttons[index]?.button;
  }
}

export { RenderContext };
