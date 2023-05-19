const { Worker } = require("worker_threads");
import amqp from "amqplib/callback_api";
import SMSService from "../service/sms";

const CLOUDAMQP_URL = process.env.CLOUDAMQP;

class SMSController {
  static async sendSMS(req, res) {
    try {
      const smsData = {
        userId: req.user.id,
        ...req.body,
      };

      const savedSMS = await SMSService.createSMS(smsData);

      amqp.connect(CLOUDAMQP_URL, (error, connection) => {
        if (error) {
          return res.status(500).json({
            status: 500,
            message: "Failed to connect to message queue",
            error: error,
          });
        }

        connection.createChannel(async (error, channel) => {
          if (error) {
            return res.status(500).json({
              status: 500,
              message: "Failed to create channel in message queue",
              error: error,
            });
          }

          const queue = "sms_task_queue";
          const msg = JSON.stringify(savedSMS);

          channel.assertQueue(queue, { durable: false });
          channel.sendToQueue(queue, Buffer.from(msg));

          console.log(" [x] Sent %s", msg);

          const worker = new Worker("./workers/SMSWorker.js", {
            workerData: savedSMS,
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

          return res.status(200).json({
            status: 200,
            message: "SMS successfully queued for sending",
            data: savedSMS,
          });
        });

        setTimeout(() => {
          connection.close();
        }, 500);
      });
    } catch (error) {
      return res.status(500).json({ status: 500, message: error });
    }
  }
}

export default SMSController;
