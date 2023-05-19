import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../app";

chai.use(chaiHttp);

chai.use(chaiHttp);
chai.should();

describe("API rate Limiter App", () => {
  describe("GET /", () => {
    it("should get welcome message", (done) => {
      chai
        .request(app)
        .get("/")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have
            .property("message")
            .eql("Welcome to API rate limiter");
          done();
        });
    });
  });
});
