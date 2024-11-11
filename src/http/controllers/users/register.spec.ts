import { app } from "@/app";
import request from "supertest";
import { describe, it, test, expect, beforeAll, afterAll } from "vitest";

describe("Register Controller(e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should be able to register", async () => {
		const response = await request(app.server).post("/users").send({
			name: "Jhon Doe",
			email: "jhondoe@email.com",
			password: "123456",
		});
		expect(response.statusCode).toEqual(201);
	});
});
