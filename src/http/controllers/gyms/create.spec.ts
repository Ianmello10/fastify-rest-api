import { app } from "@/app";
import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createAndAuthenticateUser } from "@/services/utils/test/create-and-authenticate-user";

describe("Create Gym Controller(e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should be able to create a gym", async () => {
		const { token } = await createAndAuthenticateUser(app, true);

		const createGymresponse = await request(app.server)
			.post("/gyms")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "BullDogs Gym",
				description: "Some description",
				phone: "11999999999",
				latitude: -27.2092052,
				longitude: -49.6401091,
			});

		expect(createGymresponse.statusCode).toEqual(201);
	});
});
