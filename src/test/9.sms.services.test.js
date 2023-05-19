import sinon from "sinon";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import proxyquire from "proxyquire";

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("SMS", () => {
  let prismaStub, SMS;

  beforeEach(() => {
    prismaStub = {
      sms: {
        create: sinon.stub(),
        update: sinon.stub(),
        findMany: sinon.stub(),
      },
    };
    SMS = proxyquire.noCallThru().load("../service/sms", {
      "../helpers/prismaClient": { prisma: prismaStub },
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("createSMS", () => {
    it("creates an SMS", async () => {
      const sms = { id: 1, content: "Test message", status: "SENT" };
      prismaStub.sms.create.resolves(sms);

      const result = await SMS.createSMS(sms);

      expect(result).to.deep.equal(sms);
      sinon.assert.calledWith(prismaStub.sms.create, { data: sms });
    });
  });

  describe("updateSMS", () => {
    it("updates an SMS status", async () => {
      const sms = { id: 1, content: "Test message", status: "DELIVERED" };
      prismaStub.sms.update.resolves(sms);

      const result = await SMS.updateSMS(1, "DELIVERED");

      expect(result).to.deep.equal(sms);
      sinon.assert.calledWith(prismaStub.sms.update, {
        where: { id: 1 },
        data: { status: "DELIVERED" },
      });
    });
  });

  describe("getAllSMS", () => {
    it("gets all failed SMS", async () => {
      const smsList = [
        { id: 1, content: "Test message 1", status: "FAILED" },
        { id: 2, content: "Test message 2", status: "FAILED" },
      ];
      prismaStub.sms.findMany.resolves(smsList);

      const result = await SMS.getAllSMS();

      expect(result).to.deep.equal(smsList);
      sinon.assert.calledWith(prismaStub.sms.findMany, {
        where: { status: "FAILED" },
      });
    });
  });
});
