import sinon from "sinon";
import chai from "chai";
import chaiHttp from "chai-http";
import bcrypt from "../helpers/bcrypt";
import jwt from "../helpers/jwt";
import cry from "../helpers/cry";
import UserService from "../service/user";
import Authentication from "../controllers/authentication";

chai.use(chaiHttp);
const expect = chai.expect;

describe("Authentication", () => {
  let getUserByEmailStub,
    createUserStub,
    encryptStub,
    compareStub,
    jwtSignStub,
    cryptoStub;

  beforeEach(() => {
    getUserByEmailStub = sinon.stub(UserService, "getUserByEmail");
    createUserStub = sinon.stub(UserService, "createUser");
    encryptStub = sinon.stub(bcrypt, "encrypt");
    compareStub = sinon.stub(bcrypt, "compare");
    jwtSignStub = sinon.stub(jwt, "jwtSign");
    cryptoStub = sinon.stub(cry, "crypto");
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("createAccount", () => {
    it("creates a new user account", async () => {
      const user = {
        name: "test",
        email: "test@example.com",
        password: "test123",
      };
      const req = {
        body: user,
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
      encryptStub.returns(user.password);
      getUserByEmailStub.resolves(null);
      createUserStub.resolves(user);

      await Authentication.createAccount(req, res);

      expect(res.statusCode).to.equal(200);
      expect(res.data).to.deep.equal({
        status: 200,
        message: "Signed up successfully",
        data: user,
      });
    });
  });

  describe("login", () => {
    it("logs in an existing user", async () => {
      const user = {
        email: "test@example.com",
        password: "test123",
      };
      const req = {
        body: user,
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
      const token = "valid-token";
      encryptStub.returns(user.password);
      compareStub.returns(true);
      getUserByEmailStub.resolves(user);
      cryptoStub.returns("123");
      jwtSignStub.returns(token);

      await Authentication.login(req, res);

      expect(res.statusCode).to.equal(200);
      expect(res.data).to.deep.equal({
        status: 200,
        message: "Logged in successfully!",
        token,
      });
    });
  });
});
