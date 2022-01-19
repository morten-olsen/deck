# Deck

`deck` is a full featured framework for building multi app clients for your stream deck

## Usage

Important components to understand

### Button

This represents a button on the Stream Deck and is responsible for defining what to draw and what to do when that button is pressed.

```typescript
import { Button, createText } from '@morten-olsen/deck';

const myButton = new Button({
  image: createText('Hello World'),
  action: () => {
    console.log('I was pressed');
  },
});
```

Buttons publish their own update event so if a button is rendered you can update it by setting its props.

```typescript
myButton.image = createText('Hello Earth');
```

### App

An app is made of to things; a collection of buttons and a layout. By default the app will use a basic layout displaying buttons in the order they where added with the first button being a back button if there are any previous apps to go back to

```typescript
import { App } from '@morten-olsen/deck';

const myApp = new App();
myApp.addButton(myButton);
// myApp.layout = new AbsoluteLayout();
// myApp.removeButton(myButton);
```

### Layout

A layout is what decide which button is displayed where. It gets called to do layouts of the current apps buttons, any sticky buttons the client has as well as any buttons that it might require (back, next, previous, ...etc).

### Runtime

The runtime holds the app stack. One app can open another app on top of the stack and that app can then go back to the previous app in the stack

```typescript
const myApp = new App();
myApp.addButton(
  new Button({
    image: createText('back'),
    action: ({ back }) => back(),
  }),
);

const rootApp = new App();
rootApp.addButton(
  new Button({
    image: createText('open'),
    action: ({ open }) => open(appA),
  }),
);

const runtime = new Runtime(rootApp);
```

The runtime can also add stick buttons, which are available across apps, if the layout of the specific app currently running supports them

```typescript
runtime.addStickyButton(myButton);
// runtime.removeStickyButton(myButton);
```

## Examples

You can see a working example at `packages/example`, which has a custom root app and uses a published OBS app which can be found at `apps/obs/src/index.ts`
