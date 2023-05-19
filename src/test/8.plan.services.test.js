import sinon from "sinon";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import proxyquire from "proxyquire";

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("Plan", () => {
  let prismaStub, Plan;

  beforeEach(() => {
    prismaStub = {
      plan: {
        findUnique: sinon.stub(),
      },
    };

    Plan = proxyquire.noCallThru().load("../service/plan", {
      "../helpers/prismaClient": { prisma: prismaStub },
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("getPlanById", () => {
    it("returns a plan by id", async () => {
      const plan = { id: 1, planName: "Premium", price: 100 };
      prismaStub.plan.findUnique.resolves(plan);

      const result = await Plan.getPlanById(1);

      expect(result).to.deep.equal(plan);
      sinon.assert.calledWith(prismaStub.plan.findUnique, {
        where: { id: 1 },
      });
    });
  });
});
