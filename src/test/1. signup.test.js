import chai from "chai";
import sinon from "sinon";
import chaiHttp from "chai-http";

import app from "../app";
import bcrypt from "../helpers/bcrypt";
import UserService from "../service/user";

chai.use(chaiHttp);
chai.should();

describe("Authentication", () => {
  describe("POST /auth/signup", () => {
    let encryptStub, getUserByEmailStub, createUserStub;

    beforeEach(() => {
      encryptStub = sinon.stub(bcrypt, "encrypt");
      getUserByEmailStub = sinon.stub(UserService, "getUserByEmail");
      createUserStub = sinon.stub(UserService, "createUser");
    });

    afterEach(() => {
      encryptStub.restore();
      getUserByEmailStub.restore();
      createUserStub.restore();
    });

    it("should create a new user account", (done) => {
      const newUser = { email: "test@test.com", password: "testtesttest" };
      const encryptedPassword = "encrypted";

      encryptStub.returns(encryptedPassword);
      getUserByEmailStub.resolves(null);
      createUserStub.resolves(newUser);

      chai
        .request(app)
        .post("/auth/signup")
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have
            .property("message")
            .eql("Signed up successfully");
          res.body.should.have.property("data").eql(newUser);

          sinon.assert.calledOnce(encryptStub);
          sinon.assert.calledOnce(getUserByEmailStub);
          sinon.assert.calledOnce(createUserStub);

          sinon.assert.calledWith(encryptStub, newUser.password);
          sinon.assert.calledWith(getUserByEmailStub, newUser.email);
          sinon.assert.calledWith(createUserStub, {
            ...newUser,
            password: encryptedPassword,
          });

          done();
        });
    });
  });
});
