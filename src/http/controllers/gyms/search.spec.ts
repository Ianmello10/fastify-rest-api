import { app } from "@/app";
import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createAndAuthenticateUser } from "@/services/utils/test/create-and-authenticate-user";

describe("SearchGym Controller(e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should be able to search a gym by title", async () => {
		const { token } = await createAndAuthenticateUser(app, true);

		await request(app.server)
			.post("/gyms")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "BullDogs Gym",
				description: "Some description",
				phone: "11999999999",
				latitude: -27.2092052,
				longitude: -49.6401091,
			});
		await request(app.server)
			.post("/gyms")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "LoreDog Gym",
				description: "Some description",
				phone: "11999999999",
				latitude: -27.2092052,
				longitude: -49.6401091,
			});

		const gymsResponse = await request(app.server)
			.get("/gyms/search")
			.set("Authorization", `Bearer ${token}`)
			.query({
				query: "BullDogs",
			})
			.send();

		expect(gymsResponse.statusCode).toEqual(200);
		expect(gymsResponse.body.gyms).toHaveLength(1);
		expect(gymsResponse.body.gyms).toEqual([
			expect.objectContaining({
				title: "BullDogs Gym",
			}),
		]);
	});
});
