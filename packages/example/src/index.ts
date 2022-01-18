import { ObsApp, getOBSConfig } from '@morten-olsen/deck-apps-obs';
import { App, Button, Runtime, createText } from '@morten-olsen/deck';

const clock = new Button({
  action: () => {},
});

const entertain = new Button({
  image: createText('😀', { font: 'noto fonts emoji' }),
  action: () => {},
});

const lights = new Button({
  image: createText('lights', { color: '#f39c12' }),
  action: () => {},
});

const updateClock = () => {
  const now = new Date();
  const parts = [
    now.getHours().toString(),
    now.getMinutes().toString().padStart(2, '0'),
    now.getSeconds().toString().padStart(2, '0'),
  ];
  clock.image = createText(parts.join(':'));
  setTimeout(() => {
    updateClock();
  }, 1000);
}
updateClock();

const run = async () => {
  const obsConfig = await getOBSConfig();
  const obs = new ObsApp(obsConfig);
  const rootApp = new App();
  rootApp.addButton(clock);
  rootApp.addButton(
    new Button({
      image: createText('studio', { color: '#222', background: '#f39c12' }),
      action: (api) => api.open(obs),
    })
  );
  rootApp.addButton(entertain);
  rootApp.addButton(lights);

  new Runtime(
    rootApp,
  );
};

run().catch(console.error);
