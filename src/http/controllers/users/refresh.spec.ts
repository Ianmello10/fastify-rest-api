import { app } from "@/app";
import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";

describe("Refresh Controller(e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should be able to get a new token ", async () => {
		await request(app.server).post("/users").send({
			name: "John Doe",
			email: "jhondoe@email.com",
			password: "123456",
		});

		const authResponse = await request(app.server).post("/sessions").send({
			email: "jhondoe@email.com",
			password: "123456",
		});

		const cookies = authResponse.get("Set-Cookie");

		const response = await request(app.server)
			.patch("/token/refresh")
			.set("Cookie", cookies as string[])
			.send();

		expect(response.statusCode).toEqual(200);
		expect(response.body).toEqual({
			token: expect.any(String),
		});

		expect(response.get("Set-Cookie")).toEqual([
			expect.stringContaining("refreshToken="),
		]);
	});
});
