import { Hono } from 'hono';

const builds = await Bun.build({
  entrypoints: ['./src/main.tsx'],
  target: "browser",
  minify: {
    identifiers: true,
    syntax: true,
    whitespace: true,
  },

});

const indexFile = Bun.file('index.html');

const app = new Hono();

const book = new Hono();

app.get('/main.js', async (c) => {
  // Assuming `builds` is accessible here and it contains your output from Bun.build
  const stream = builds.outputs[0].stream(); // Your JS file stream
  return c.body(stream, 200, {
    'Content-Type': builds.outputs[0].type, // Correct MIME type, e.g., 'text/javascript'
  });


});

// Serve the index.html file
app.get('/', async (c) => {
  const indexContent = await indexFile.text();
  return c.html(indexContent);
});

book.get('/', (c) => c.json('Hello Book!'));


app.route('/book', book);


// app.listen({ port: 3005 });
export default app;