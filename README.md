# How Long Until?

A web app to show how long until various upcoming events. I get this question a lot from my kids.

Add birthdays, holidays, trips, and events to the list, and they automatically get updated in real time.

Built with:

* React
* Redux
* moment.js
* Webpack

## Usage

Configure events by adding a `build/events.json` file - see `build/events.example.json` for possibilities.

Initial build of the application:

```sh
npm install
npm run build
```

Run the application in the webpack dev server:

```sh
npm start
```

Or just serve the static files with `build/` as the web root.