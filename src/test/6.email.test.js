import sinon from "sinon";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import amqp from "amqplib/callback_api";
import EmailService from "../service/email";
import EmailController from "../controllers/email";

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("EmailController", () => {
  let createEmailStub, connectStub, statusStub, jsonStub;

  beforeEach(() => {
    statusStub = sinon.stub();
    jsonStub = sinon.stub();

    statusStub.returns({ json: jsonStub });

    createEmailStub = sinon.stub(EmailService, "createEmail");
    connectStub = sinon.stub(amqp, "connect");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("sendEmail", () => {
    it("sends an email", async () => {
      const req = {
        user: { id: 1 },
        body: {},
      };
      const res = { status: statusStub };
      const email = { id: 1, subject: "Test", message: "Test Message" };

      createEmailStub.resolves(email);
      connectStub.callsFake((url, cb) =>
        cb(null, {
          createChannel: (cb) =>
            cb(null, { assertQueue: () => {}, sendToQueue: () => {} }),
        })
      );

      await EmailController.sendEmail(req, res);

      expect(statusStub.calledWith(200)).to.be.true;
      expect(
        jsonStub.calledWith({
          status: 200,
          message: "Email successfully queued for sending",
          data: email,
        })
      ).to.be.true;
    });
  });
});
