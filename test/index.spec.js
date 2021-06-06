const supertest = require("supertest");
const assert = require("assert");
const app = require("../app");

describe("GET /api", function () {
  it("it should has status code 200", function (done) {
    supertest(app)
      .get("/api")
      .expect(200)
      .end(function (err, res) {
        if (err) done(err);
        done();
      });
  });
  it("it should give Hello World message", function (done) {
    supertest(app)
      .get("/api")
      .expect({ success: true, message: "Hello World" })
      .end(function (err, res) {
        if (err) done(err);
        done();
      });
  });
});
