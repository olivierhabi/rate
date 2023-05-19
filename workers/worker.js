const { workerData, parentPort } = require("worker_threads");
const amqp = require("amqplib/callback_api");
const EmailService = require("../src/service/email");

const CLOUDAMQP_URL = process.env.CLOUDAMQP;

amqp.connect(CLOUDAMQP_URL, (err, conn) => {
  if (err) {
    parentPort.postMessage({ error: "Failed to connect to CloudAMQP" });
    return;
  }

  conn.createChannel(async (err, ch) => {
    if (err) {
      parentPort.postMessage({
        error: "Failed to create channel in CloudAMQP",
      });
      return;
    }

    const queue = "email_task_queue";

    ch.assertQueue(queue, { durable: false });

    ch.consume(queue, async (msg) => {
      if (msg !== null) {
        const emailData = JSON.parse(msg.content.toString());
        //SEND email to SENDGRID API and UPDATE EMAIL STATUS
        try {
          console.log(emailData, "+++++++++++++++++++++ NOW WHAT");
          const updateEmail = await EmailService.updateEmail(
            emailData?.id,
            "DELIVERED"
          );
          parentPort.postMessage({
            message: "Email successfully sent and updated",
            data: updateEmail,
          });
        } catch (error) {
          parentPort.postMessage({
            error: "Failed to update email",
            details: error,
          });
        }
        ch.ack(msg);
      }
    });
  });
});
