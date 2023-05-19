import sinon from "sinon";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { RateLimiterRedis } from "rate-limiter-flexible";
import {
  createRateLimitersForPlan,
  fixedWindowRateLimiter,
} from "../helpers/service";

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("Rate Limiting", () => {
  let rateLimiterStub;
  let consumeStub;

  beforeEach(() => {
    consumeStub = sinon.stub();
    rateLimiterStub = sinon
      .stub(RateLimiterRedis.prototype, "consume")
      .callsFake(consumeStub);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("createRateLimitersForPlan", () => {
    it("creates rate limiters for a given plan", () => {
      const plan = {
        type: "basic",
        ReqPerSec: 5,
        ReqPerMonth: 5000,
      };

      const limiters = createRateLimitersForPlan(plan);

      expect(limiters).to.have.property("perSecondLimiter");
      expect(limiters).to.have.property("perSecondSoftThrottleLimiter");
      expect(limiters).to.have.property("perMonthLimiter");
    });
  });

  describe("fixedWindowRateLimiter", () => {
    it("consumes points from rate limiters", async () => {
      const plan = {
        type: "basic",
        ReqPerSec: 5,
        ReqPerMonth: 5000,
      };

      const limiters = createRateLimitersForPlan(plan);

      const req = {
        user: {
          email: "user1@example.com",
          plan: plan,
        },
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
      const next = sinon.spy();

      consumeStub.resolves();

      await fixedWindowRateLimiter(req, res, next);

      sinon.assert.calledWith(consumeStub, req.user.email);
      sinon.assert.calledOnce(next);
    });
  });
});
