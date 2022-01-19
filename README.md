# Deck

`deck` is a full featured framework for building multi app clients for your stream deck

## Getting started

### Installation

```
yarn add @morten-olsen/deck
```

If you are running on linux you also need to take the platform specific step described in [@elgato-stream-deck/node](https://www.npmjs.com/package/@elgato-stream-deck/node#Linux)

### Writing your first app

A `deck` client consist of one or more apps, so to get started you will need to create an app. This is pretty simple; create a new instance of `App`

```typescript
import { App } from '@morten-olsen/deck';

const myApp = new App();
```

That's it, you have your first app!

### Putting the app on the deck

To actually render our app unto a Stream Deck you need a runtime to serve your app, again this is pretty simple, just create a new instance of `Runtime` and pass it your new app.

```typescript
import { Runtime } from '@morten-olsen/deck';

const runtime = new Runtime(myApp);
```

Run your code and you should see... well nothing yet as our app doesn't contain any buttons

### Adding buttons

To add a button to our app call `addButton` on your app with an instance of a button. Buttons consist of `image` which is what should be rendered on the button and an `action` which is what should happen when that button is pressed.

```typescript
import { Button, createText } from '@morten-olsen/deck';

const myButton = new Button({
  image: createText('My button!'),
  action: () => console.log('The button was pressed'),
});

myApp.addButton(myButton);
```

Now you chould see a button with the text "My button!" on your Stream Deck, and when you press it, you should see "The button was pressed" being printed in the console.

You can remove buttons using the `removeButton` method on your app

```typescript
myApp.removeButton(myButton);
```

Buttons are automatically updated once their properties change, so let's create a button which shows the current time.

```typescript
const clock = new Button({});

const updateClock = () => {
  clock.image = createText(new Date().toISOString());
  setTimeout(updateClock, 1000);
}
updateClock();
myApp.addButton(clock);
```

You should now have a button which shows the current time.

### Navigating

`deck` is intended for multiple apps, where apps can open other apps or go back to the previous one. Button `action` receive an api which can be used for this navigation.

```
const appA = new App();
const backButton = new Button({
  image: createText('Go back'),
  action: (api) => api.back(),
});

const rootApp = new App();
const openButton = new Button({
  image: createText('Open appA'),
  action: (api) => api.open(appA),
});

const runtime = new Runtime(rootApp);
```

Now you will have one button called "Open appA", which when clicked will navigate to `appA`, which will have two back buttons (one with a back arrow and one with the text "Go back). The reason that you have two is that apps uses a `BasicLayout` which will automatically render a back button if there are any apps to go back to.

There are a few navigation method available on the api

* `back()`: Goes back to the previous app
* `open(app)`: Opens the given app. If the app is already in the navigation stack it will be moved to the top.
* `popTo(app)`: If the app exists in the navigation stack it will pop down to that instance. If it doesn't exist it will be added to the top.
* `updateStack(updateFunction)`: Allows you to manipulate the navigation stack by providing a function which gets an app array and returns an app array (`(apps) => apps.reverse()` would inverse the navigation stack). _NOTE: you always have to return an array with at least one app in it_

### Layouts

Apps can have different layouts, which are responsible for deciding where the buttons are place on the deck.

These layouts has to take make a layout of the current apps buttons, the runtimes sticky buttons as well as any additional buttons that may be required (back, next, prev, etc.).

At the moment only the `BasicLayout` is supported, but more will come in the future, as well as a guide on how to write your own layouts.

## Examples

You can see a fully working example of an app inside [packages/example](packages/example) which is also using a pre built OBS app which can be found at [apps/obs](apps/obs.)
