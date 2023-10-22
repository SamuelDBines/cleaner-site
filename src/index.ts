import { Hono } from 'hono';

const app = new Hono();
app.get('/', (c) => c.text('Hello Bun!'));

const book = new Hono();

book.get('/', (c) => c.json('Hello Book!'));

app.route('/book', book);

export default app;