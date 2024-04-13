import { Hono } from 'hono';
import { streamText, streamSSE } from 'hono/streaming';

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

// app.get('/subscribe', (c) => {
//   return streamText(c, async (stream: any) => {
//     // Write a process to be executed when aborted.
//     stream.onAbort(() => {
//       console.log('Aborted!');
//     });
//     // Write a Uint8Array.
//     await stream.write("hey\n\n");
//     // Pipe a readable stream.
//     // await stream.pipe(anotherReadableStream);
//   });
// });

let id = 0;

app.get('/watcher', async (c) => {
  return streamSSE(c, async (stream) => {

    const message = `It is ${new Date().toISOString()}`;
    await stream.writeSSE({
      data: message,
      event: 'reload',
      id: String(id++),
    });
  });
});

book.get('/', (c) => c.json('Hello Book!'));


app.route('/book', book);


// app.listen({ port: 3005 });
export default app;