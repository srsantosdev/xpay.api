import app from './app';

const PORT = process.env.PORT ?? 3333;
const HOST = '0.0.0.0';

app.listen(
  {
    host: HOST,
    port: PORT,
  },
  () => {
    console.info(`✔ Server is running on ${HOST}:${PORT}`);
  },
);
