const { workerData, parentPort } = require("worker_threads");

const EmailService = require("../src/service/email");

async function processEmail(emailData) {
  try {
    const result = await EmailService.updateEmail(emailData.id, "DELIVERED");
    return result;
  } catch (error) {
    throw error;
  }
}

(async () => {
  try {
    const updateResult = await processEmail(workerData);
    parentPort.postMessage({
      message: "Email successfully sent and updated",
      data: updateResult,
    });
  } catch (error) {
    parentPort.postMessage({ error: "Failed to update email", error: error });
  }
})();
