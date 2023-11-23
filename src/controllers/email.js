const { Worker } = require("worker_threads");
import amqp from "amqplib/callback_api";
import EmailService from "../service/email";

const CLOUDAMQP_URL = process.env.CLOUDAMQP;

class EmailController {
  static async sendEmail(req, res) {
    try {
      const emailData = {
        userId: req.user.id,
        ...req.body,
      };

      const savedEmail = await EmailService.createEmail(emailData);

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

          const queue = "email_task_queue";
          const msg = JSON.stringify(savedEmail);

          channel.assertQueue(queue, { durable: false });
          channel.sendToQueue(queue, Buffer.from(msg));

          console.log(" [x] Sent %s", msg);

          // const worker = new Worker("./workers/worker.js", {
          //   workerData: savedEmail,
          // });

          // // Create a new promise that resolves when the worker sends a message
          // new Promise((resolve, reject) => {
          //   worker.on("message", (data) => {
          //     console.log(data, "==================== RESOLVE");
          //     resolve(data);
          //   });
          //   worker.on("error", (error) => {
          //     console.log("==================== ERROR");
          //     reject(error);
          //   });
          //   worker.on("exit", (code) => {
          //     console.log("==================== exit");
          //     if (code != 0) {
          //       reject(new Error(`Worker stopped with exit code ${code}`));
          //     }
          //   });
          // });

          return res.status(200).json({
            status: 200,
            message: "Email successfully queued for sending",
            data: savedEmail,
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
  static async getEmail(req, res) {}
}

export default EmailController;
