import execa from 'execa';
import { App, Button, createText, createCanvas, getConfig } from '@morten-olsen/deck';
import OBSSocket from 'obs-websocket-js';
import ps from 'ps-node';

const handleError = <TArgs extends any[], TReturn extends Promise<any>>(fn:(...args: TArgs) => TReturn) => async (...args: TArgs) => {
  return fn(...args).catch(console.error);
}

const debounce = <TArgs extends any[]>(fn: (...args: TArgs) => any, timeout = 300) => {
  let timer: NodeJS.Timeout | undefined;
  return (...args: TArgs) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => { fn.apply(this, args); }, timeout);
  };
}

const playButton = createCanvas((canvas) => {
  const width = canvas.width * 0.3;
  const height = canvas.width * 0.4;
  const centerX = canvas.width / 2 - 20;
  const centerY = canvas.width / 2;
  canvas.setStrokeWidth(60);
  canvas.setStroke('#666');
  canvas.setColor('#222');
  canvas.beginPath()
  canvas.moveTo(centerX - width / 2, centerY - height / 2)
  canvas.lineTo(centerX + width / 2, centerY)
  canvas.lineTo(centerX - width / 2, centerY + height / 2)
  canvas.closePath();
  canvas.stroke();
  canvas.fill();
  return canvas;
});

interface Scenes {
  [name: string]: Button;
}

interface Options {
  address?: string;
  password?: string;
}

const getOBSConfig = (name = 'obs') => getConfig<Options>(name, [
  { type: 'string', name: 'address' },
  { type: 'secret', name: 'password' },
]);

class ObsApp extends App {
  #startButton: Button;
  #connectButton: Button;
  #killButton: Button;
  #socket: OBSSocket;
  #scenes: Scenes = {};
  #connected: boolean = false;
  #options: Options;

  constructor(options: Options) {
    super();
    this.#options = options;
    this.#startButton = new Button({
      image: playButton,
      action: () => {
        execa('obs')
      },
    });

    this.#connectButton = new Button({
      image: createText('connect', { background: '#27ae60', color: '#000' }),
      action: this.#start,
    });
    this.#killButton = new Button({
      image: createText('kill', { color: 'white', background: '#c0392b', autoScale: false }),
      action: this.#kill,
    });
    this.#socket = new OBSSocket();
      
    this.#socket.on('ConnectionClosed', this.#disconnect);
    this.#socket.on('ScenesChanged', this.#setup);
    this.#socket.on('SwitchScenes', this.#setup);
    this.#checkIfRunning();
  }

  #checkIfRunning = () => {
    ps.lookup({ command: 'obs' }, (_, resultList) => {
      if (resultList.length === 0) {
        this.addButton(this.#startButton);
        this.removeButton(this.#killButton);
        this.removeButton(this.#connectButton);
      } else {
        this.removeButton(this.#startButton);
        this.addButton(this.#killButton);
        if (!this.#connected) {
          this.addButton(this.#connectButton);
        } else {
          this.removeButton(this.#connectButton);
        }
      }
      setTimeout(() => {
        this.#checkIfRunning();
      }, 300);
    });
  }

  #start = handleError(async () => {
    await this.#socket.connect({
      address: this.#options.address,
      password: this.#options.password,
    });
    this.#setup();
    this.#connected = true;
  });

  #kill = () => {
    ps.lookup({ command: 'obs' }, (_, resultList) => {
      resultList.forEach(process => ps.kill(process.pid));
    });
  }

  #disconnect = () => {
    Object.values(this.#scenes).forEach(b => this.removeButton(b));
    this.#scenes = {};
    this.#connected = false;
  }

  #setup = debounce(handleError(async () => {
    Object.values(this.#scenes).forEach(b => this.removeButton(b));
    this.#scenes = {};
    const scenes = await this.#socket.send('GetSceneList');
    for (let scene of scenes.scenes) {
      const selected = scene.name === scenes['current-scene'];
      const button = new Button({
        image: createText(scene.name.toLowerCase(), {
          color: selected ? 'green' : 'yellow',
          background: selected ? 'yellow' : '#222'
        }),
        action: () => {
          this.#socket.send('SetCurrentScene', {
            'scene-name': scene.name
          });
        },
      });
      this.#scenes[scene.name] = button;
      this.addButton(button);
    }
  }), 30);
}

export { ObsApp, getOBSConfig };
