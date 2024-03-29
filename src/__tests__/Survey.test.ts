import request from "supertest";
import { getConnection } from "typeorm";
import { app } from "../app";

import createConnection from "../database";

describe("Survey", () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create new survey", async () => {
    const response = await request(app).post("/surveys").send({
      title: "title examples",
      description: "Example survesy",
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("survey");
  });

  it("should be get survey", async () => {
    await request(app).post("/surveys").send({
      title: "title examples2",
      description: "Example2",
    });
    const response = await request(app).get("/surveys");
    expect(response.body.length).toBe(2);
  });
});
