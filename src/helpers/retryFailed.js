import EmailService from "../service/email";
import SMSService from "../service/sms";
import amqp from "amqplib/callback_api";
const { Worker } = require("worker_threads");

const CLOUDAMQP_URL = process.env.CLOUDAMQP;

export const failedSMS = async () => {
  const sms = await SMSService.getAllSMS();
  
  if (sms.length > 0) {
    sms.forEach(async (sms) => {
      amqp.connect(CLOUDAMQP_URL, (error, connection) => {
        if (error) {
          console.log(error);
        }

        connection.createChannel(async (error, channel) => {
          if (error) {
            console.log(error);
            return;
          }

          const queue = "sms_task_queue";
          const msg = JSON.stringify(sms);

          channel.assertQueue(queue, { durable: false });
          channel.sendToQueue(queue, Buffer.from(msg));

          console.log(" [x] Sent %s", msg);

          const worker = new Worker("./workers/SMSWorker.js", {
            workerData: sms,
          });

          // Create a new promise that resolves when the worker sends a message
          new Promise((resolve, reject) => {
            worker.on("message", (data) => {
              resolve(data);
            });
            worker.on("error", (error) => {
              reject(error);
            });
            worker.on("exit", (code) => {
              if (code != 0) {
                reject(new Error(`Worker stopped with exit code ${code}`));
              }
            });
          });
        });

        setTimeout(() => {
          connection.close();
        }, 500);
      });

      await SMSService.updateSMS(sms.id, "RETRY");
    });
  }
};

export const failedEmail = async () => {
  const emails = await EmailService.getAllEmail();
  if (emails.length > 0) {
    emails.forEach(async (email) => {
      amqp.connect(CLOUDAMQP_URL, (error, connection) => {
        if (error) {
          console.log(error);
        }

        connection.createChannel(async (error, channel) => {
          if (error) {
            return res.status(500).json({
              status: 500,
              message: "Failed to create channel in message queue",
              error: error,
            });
          }

          const queue = "email_task_queue";
          const msg = JSON.stringify(email);

          channel.assertQueue(queue, { durable: false });
          channel.sendToQueue(queue, Buffer.from(msg));

          console.log(" [x] Sent %s", msg);

          const worker = new Worker("./workers/worker.js", {
            workerData: email,
          });

          // Create a new promise that resolves when the worker sends a message
          new Promise((resolve, reject) => {
            worker.on("message", (data) => {
              resolve(data);
            });
            worker.on("error", (error) => {
              reject(error);
            });
            worker.on("exit", (code) => {
              if (code != 0) {
                reject(new Error(`Worker stopped with exit code ${code}`));
              }
            });
          });
        });

        setTimeout(() => {
          connection.close();
        }, 500);
      });

      await EmailService.updateEmail(email.id, "RETRY");
    });
  }
};
