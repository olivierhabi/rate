const { Worker } = require("worker_threads");
require("dotenv").config();

const CLOUDAMQP_URL = process.env.CLOUDAMQP;

const amqp = require("amqplib");

async function startConsumer() {
  const conn = await amqp.connect(CLOUDAMQP_URL);
  const ch = await conn.createChannel();

  const queue = "email_task_queue";
  await ch.assertQueue(queue, { durable: false });

  console.log("Waiting for messages in %s", queue);
  ch.consume(queue, (msg) => {
    if (msg !== null) {
      const emailData = JSON.parse(msg.content.toString());

      const worker = new Worker("./workers/email.js", {
        workerData: emailData,
      });

      // Create a new promise that resolves when the worker sends a message
      new Promise((resolve, reject) => {
        worker.on("message", (data) => {
          console.log(data, "========================== HELLO NOW");
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
    }
  });
}

startConsumer().catch(console.warn);
