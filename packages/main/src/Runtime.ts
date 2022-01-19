import { openStreamDeck, StreamDeck } from 'elgato-stream-deck';
import { App, Button } from './App';
import { ActionApi } from './ActionApi';
import { RenderContext } from './RenderContext';

class Runtime implements ActionApi {
  #stack: App[];
  #deck: StreamDeck;
  #stickyButtons: Button[] = [];
  #renderContext: RenderContext;

  constructor(root: App) {
    this.#stack = [root];
    this.#deck = openStreamDeck();
    this.#renderContext = new RenderContext(this.#deck);
    this.#focus();
    this.#deck.on('down', this.#onDown);
  }

  get #current() {
    return [...this.#stack].pop()!;
  }

  #render = () => {
    const appButtons = this.#current.buttons;
    const buttons = this.#current.layout.position({
      isRoot: this.#stack.length === 1,
      appButtons,
      stickyButtons: this.#stickyButtons,
      api: this,
      rows: this.#deck.KEY_ROWS,
      columns: this.#deck.KEY_COLUMNS,
    });
    this.#renderContext.render(buttons)
  }

  #focus = () => {
    const app = this.#current;
    app.on('add', this.#onAdd);
    app.on('remove', this.#onRemove);
    app.on('render', this.#render);
    this.#render();
  } 

  #unfocus = (app: App) => {
    app.off('add', this.#onAdd);
    app.off('remove', this.#onRemove);
    app.off('render', this.#render);
  }

  #onAdd = () => {
    this.#render();
  }

  #onRemove = () => {
    this.#render();
  }

  #onDown = (index: number) => {
    const button = this.#renderContext.get(index);
    if (!button) return;
    button.action(this);
  }

  public update = () => {
    this.#render();
  }

  public back = () => {
    if (this.#stack.length < 2) return;
    const current = this.#stack.pop()!;
    this.#unfocus(current);
    this.#focus();
  }

  public open = (app: App) => {
    this.#unfocus(this.#current);
    if (this.#stack.includes(app)) {
      const index = this.#stack.findIndex(a => a === app);
      this.#stack.splice(index, 1);
    }
    this.#stack.push(app);
    this.#focus();
  }

  public addStickButton = (button: Button) => {
    if (this.#stickyButtons.includes(button)) {
      return;
    }
    this.#stickyButtons.push(button);
    this.#render();
  }

  public removeStickyButton = (button: Button) => {
    if (!this.#stickyButtons.includes(button)) {
      return;
    }
    this.#stickyButtons.push(button);
    this.#render();
  }
}

export { Runtime };
