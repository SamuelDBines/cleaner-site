import { Hono } from 'hono';

const builds = await Bun.build({
  entrypoints: ['../main.tsx'],
  target: "browser",
  minify: {
    identifiers: true,
    syntax: true,
    whitespace: true,
  },

});


const app = new Hono();

const book = new Hono();

book.get('/', (c) => c.json('Hello Book!'));


app.route('/book', book);


export default app;