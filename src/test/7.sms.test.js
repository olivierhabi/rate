import sinon from "sinon";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import proxyquire from "proxyquire";
import amqp from "amqplib/callback_api";
import { Worker } from "worker_threads";

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("SMSController", () => {
  let SMSServiceStub, amqpStub, workerStub, SMSController;
  const CLOUDAMQP_URL = process.env.CLOUDAMQP;
  const queue = "sms_task_queue";

  beforeEach(() => {
    SMSServiceStub = {
      createSMS: sinon.stub(),
    };

    amqpStub = {
      connect: sinon.stub(),
    };

    workerStub = sinon.stub();

    SMSController = proxyquire("../controllers/sms", {
      "../service/sms": SMSServiceStub,
      "amqplib/callback_api": amqpStub,
      worker_threads: { Worker: workerStub },
    }).default;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("sendSMS", () => {
    it("sends an SMS", async () => {
      const req = {
        user: { id: 1 },
        body: { message: "Hello, world!" },
      };

      const res = {
        status: function (statusCode) {
          this.statusCode = statusCode;
          return this;
        },
        json: function (data) {
          this.data = data;
          return this;
        },
      };

      const smsData = {
        userId: req.user.id,
        ...req.body,
      };

      const savedSMS = { id: 1, ...smsData };
      SMSServiceStub.createSMS.resolves(savedSMS);

      // Simulate the AMQP connect callback
      amqpStub.connect.callsFake((url, cb) => {
        cb(null, {
          createChannel: function (cb) {
            cb(null, {
              assertQueue: sinon.stub(),
              sendToQueue: sinon.stub(),
            });
          },
          close: sinon.stub(),
        });
      });

      await SMSController.sendSMS(req, res);

      expect(res.statusCode).to.equal(200);
      expect(res.data).to.deep.equal({
        status: 200,
        message: "SMS successfully queued for sending",
        data: savedSMS,
      });
      sinon.assert.calledWith(SMSServiceStub.createSMS, smsData);
      sinon.assert.calledWith(amqpStub.connect, CLOUDAMQP_URL);
      sinon.assert.calledWith(workerStub, "./workers/SMSWorker.js", {
        workerData: savedSMS,
      });
    });

    // Additional tests can go here for other cases
  });
});
