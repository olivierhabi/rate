import sinon from "sinon";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import jwt from "../helpers/jwt";
import UserService from "../service/user";
import Access from "../middlewares/authentication";
import { STARTER_PLAN } from "../config/starterPlan";

chai.use(chaiAsPromised);
const expect = chai.expect;

describe("Access", () => {
  let jwtVerifyStub;
  let getUserByEmailStub;

  beforeEach(() => {
    jwtVerifyStub = sinon.stub(jwt, "jwtVerify");
    getUserByEmailStub = sinon.stub(UserService, "getUserByEmail");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("auth", () => {
    // previous test cases...

    it("properly handles user with plan", async () => {
      const req = {
        headers: {
          authorization: "Bearer token",
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
      const mockDecoded = { email: "user@domain.com" };
      const mockUser = {
        email: "user@domain.com",
        id: 1,
        planId: 2,
        Plan: {
          id: 2,
          ReqPerMonth: "1000",
          ReqPerSec: "10",
        },
      };

      jwtVerifyStub.returns(mockDecoded);
      getUserByEmailStub.resolves(mockUser);

      await Access.auth(req, res, next);

      // Convert the strings to integers
      mockUser.Plan.ReqPerMonth = parseInt(mockUser.Plan.ReqPerMonth);
      mockUser.Plan.ReqPerSec = parseInt(mockUser.Plan.ReqPerSec);
      // Remove the planId and id from the user
      delete mockUser.planId;
      delete mockUser.Plan.id;

      expect(req.user).to.deep.equal({
        email: mockUser.email,
        id: mockUser.id,
        plan: { ...mockUser.Plan },
      });
      expect(next.calledOnce).to.be.true;
    });

    it("properly handles user without a plan", async () => {
      const req = {
        headers: {
          authorization: "Bearer token",
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
      const mockDecoded = { email: "user@domain.com" };
      const mockUser = {
        email: "user@domain.com",
        id: 1,
      };

      jwtVerifyStub.returns(mockDecoded);
      getUserByEmailStub.resolves(mockUser);

      await Access.auth(req, res, next);

      expect(req.user).to.deep.equal({
        email: mockUser.email,
        id: mockUser.id,
        plan: { ...STARTER_PLAN },
      });
      expect(next.calledOnce).to.be.true;
    });
  });
});
