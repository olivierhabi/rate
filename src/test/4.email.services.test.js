import sinon from "sinon";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import proxyquire from "proxyquire";

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("Email", () => {
  let prismaStub, Email;

  beforeEach(() => {
    prismaStub = {
      email: {
        create: sinon.stub(),
        update: sinon.stub(),
        findMany: sinon.stub(),
      },
    };

    Email = proxyquire.noCallThru().load("../service/email", {
      "../helpers/prismaClient": { prisma: prismaStub },
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("createEmail", () => {
    it("creates an email", async () => {
      const email = { id: 1, address: "email1@example.com", status: "SENT" };
      prismaStub.email.create.resolves(email);

      const result = await Email.createEmail(email);

      expect(result).to.deep.equal(email);
      sinon.assert.calledWith(prismaStub.email.create, { data: email });
    });
  });

  describe("updateEmail", () => {
    it("updates an email status", async () => {
      const email = { id: 1, address: "email1@example.com", status: "FAILED" };
      prismaStub.email.update.resolves(email);

      const result = await Email.updateEmail(1, "FAILED");

      expect(result).to.deep.equal(email);
      sinon.assert.calledWith(prismaStub.email.update, {
        where: { id: 1 },
        data: { status: "FAILED" },
      });
    });
  });

  describe("getAllEmail", () => {
    it("returns all emails with FAILED status", async () => {
      const emails = [
        { id: 1, address: "email1@example.com", status: "FAILED" },
        { id: 2, address: "email2@example.com", status: "FAILED" },
      ];
      prismaStub.email.findMany.resolves(emails);

      const result = await Email.getAllEmail();

      expect(result).to.deep.equal(emails);
      sinon.assert.calledWith(prismaStub.email.findMany, {
        where: { status: "FAILED" },
      });
    });
  });
});
