import app from "./app";
import cron from "node-cron";
import { failedEmail, failedSMS } from "./helpers/retryFailed";
require("dotenv").config();

const { SERVER_PORT = 3000 } = process.env;

// This cron job will run every 6 hours
cron.schedule("0 */6 * * *", () => {
  failedEmail();
  failedSMS();
});

app.listen(SERVER_PORT, async () => {
  await console.log(`Server started on port: ${SERVER_PORT}`);
});
