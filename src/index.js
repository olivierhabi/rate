import app from "./app";

const { SERVER_PORT = 3000 } = process.env;

app.listen(SERVER_PORT, async () => {
  await console.log(`Server started on port: ${SERVER_PORT}`);
});
