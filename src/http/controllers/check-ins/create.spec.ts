import { app } from "@/app";
import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createAndAuthenticateUser } from "@/services/utils/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";

describe("Create Check-In Controller(e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should be able to create a check-in", async () => {
		const { token } = await createAndAuthenticateUser(app);

		const gym = await prisma.gym.create({
			data: {
				title: "BullDogs Gym",
				description: "Some description",
				phone: "11999999999",
				latitude: -27.2092052,
				longitude: -49.6401091,
			},
		});

		const createCheckInresponse = await request(app.server)
			.post(`/gyms/${gym.id}/check-in`)
			.set("Authorization", `Bearer ${token}`)
			.send({
				latitude: -27.2092052,
				longitude: -49.6401091,
			});

		expect(createCheckInresponse.statusCode).toEqual(201);
	});
});
