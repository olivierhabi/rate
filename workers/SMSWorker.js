const { workerData, parentPort } = require("worker_threads");
const amqp = require("amqplib/callback_api");
const SMSService = require("../src/service/sms");

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

    const queue = "sms_task_queue";

    ch.assertQueue(queue, { durable: false });

    ch.consume(queue, async (msg) => {
      if (msg !== null) {
        const smsData = JSON.parse(msg.content.toString());

        try {
          //SEND SMS to SMS API and UPDATE SMS STATUS (SMS SERVICE)
          const updateSMS = await SMSService.updateSMS(
            smsData?.id,
            "DELIVERED"
          );
          parentPort.postMessage({
            message: "Email successfully sent and updated",
            data: updateSMS,
          });
        } catch (error) {
          parentPort.postMessage({
            error: "Failed to retry and update sms",
            details: error,
          });
        }
        ch.ack(msg);
      }
    });
  });
});
