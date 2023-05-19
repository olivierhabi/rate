import httpMocks from "node-mocks-http";
import sinon from "sinon";
import Authentication from "../controllers/authentication";
import UserService from "../service/user";
import bcrypt from "../helpers/bcrypt";
import jwt from "../helpers/jwt";
import chai, { expect } from "chai";

describe("Authentication", () => {
  it("should return status 403 when email or password is incorrect", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: { password: "wrongpassword", email: "wrongemail@test.com" },
    });

    const res = httpMocks.createResponse();

    const getUserByEmailStub = sinon
      .stub(UserService, "getUserByEmail")
      .resolves(null);

    const bcryptCompareStub = sinon.stub(bcrypt, "compare").resolves(false);

    await Authentication.login(req, res);

    expect(res.statusCode).to.equal(403);
    const jsonResponse = res._getData();
    const response = JSON.parse(jsonResponse);
    expect(response.message).to.equal("Invalid email or password!");

    expect(getUserByEmailStub.calledOnce).to.be.true;
    expect(bcryptCompareStub.called).to.be.false;

    getUserByEmailStub.restore();
    bcryptCompareStub.restore();
  });

  it("should return status 200 when login is successful", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: { password: "rightpassword", email: "rightemail@test.com" },
    });

    const res = httpMocks.createResponse();

    const mockUser = {
      password: "hashedpassword",
      email: "rightemail@test.com",
    };

    const getUserByEmailStub = sinon
      .stub(UserService, "getUserByEmail")
      .resolves(mockUser);

    const bcryptCompareStub = sinon.stub(bcrypt, "compare").resolves(true);

    const jwtSignStub = sinon.stub(jwt, "jwtSign").returns("token");

    await Authentication.login(req, res);

    expect(res.statusCode).to.equal(200);
    const jsonResponse = res._getData();
    const response = JSON.parse(jsonResponse);
    expect(response.status).to.equal(200);
    expect(response.message).to.equal("Logged in successfully!");
    expect(response.token).to.equal("token");

    expect(getUserByEmailStub.calledOnce).to.be.true;
    expect(bcryptCompareStub.calledOnce).to.be.true;
    expect(jwtSignStub.calledOnce).to.be.true;

    sinon.restore();
  });
});
