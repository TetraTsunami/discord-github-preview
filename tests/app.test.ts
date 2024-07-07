import request from "supertest";
import app from "@/app";

describe("Test the base path", () => {
  test("It should respond to the GET method", () => {
    return request(app)
      .get("/api")
      .then(response => {
        expect(response.statusCode).toBe(200);
      });
  });
});