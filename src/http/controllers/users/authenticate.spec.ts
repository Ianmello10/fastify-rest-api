import { app } from "@/app";
import request from "supertest";
import { describe, it, test, expect, beforeAll, afterAll } from "vitest";

describe("Authenticate Controller(e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should be able to authenticate", async () => {
		await request(app.server).post("/users").send({
			name: "John Doe",
			email: "jhondoe@email.com",
			password: "123456",
		});

		const response = await request(app.server).post("/sessions").send({
			email: "jhondoe@email.com",
			password: "123456",
		});
		expect(response.statusCode).toEqual(200);
		expect(response.body).toEqual({
			token: expect.any(String),
		});
	});
});
