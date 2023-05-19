import app from "./app";
import cron from "node-cron";
import { failedEmail } from "./helpers/retryFailed";

const { SERVER_PORT = 3000 } = process.env;

// This cron job will run every second
// cron.schedule("* * * * * *", () => {
//   failedEmail();
// });
cron.schedule("0 */6 * * *", () => {
  failedEmail();
});

app.listen(SERVER_PORT, async () => {
  await console.log(`Server started on port: ${SERVER_PORT}`);
});
