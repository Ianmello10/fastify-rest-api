import { app } from "@/app";
import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createAndAuthenticateUser } from "@/services/utils/test/create-and-authenticate-user";

describe("Search Nearby Gyms Controller(e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should be able to search nearby gyms", async () => {
		const { token } = await createAndAuthenticateUser(app, true);

		await request(app.server)
			.post("/gyms")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "Near Gym",
				description: null,
				phone: null,
				latitude: -27.2092052,
				longitude: -49.6401091,
			});
		await request(app.server)
			.post("/gyms")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "Far Gym",
				description: null,
				phone: null,
				latitude: -23.4946043,
				longitude: -47.457271,
			});

		const gymsResponse = await request(app.server)
			.get("/gyms/nearby")
			.set("Authorization", `Bearer ${token}`)
			.query({
				latitude: -27.2092052,
				longitude: -49.6401091,
			});

		expect(gymsResponse.statusCode).toEqual(200);
		expect(gymsResponse.body.gyms).toHaveLength(1);
		expect(gymsResponse.body.gyms).toEqual([
			expect.objectContaining({
				title: "Near Gym",
			}),
		]);
	});
});
