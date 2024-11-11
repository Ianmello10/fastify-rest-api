import { app } from "@/app";
import request from "supertest";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createAndAuthenticateUser } from "@/services/utils/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";

describe("Get Check-Ins user Metrics Controller(e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should be able to get  check-in metrics", async () => {
		const { token } = await createAndAuthenticateUser(app);

		const user = await prisma.user.findFirstOrThrow();

		const gym = await prisma.gym.create({
			data: {
				title: "BullDogs Gym",
				description: "Some description",
				phone: "11999999999",
				latitude: -27.2092052,
				longitude: -49.6401091,
			},
		});

		await prisma.checkIn.createMany({
			data: [
				{
					gymId: gym.id,
					userId: user.id,
				},
				{
					gymId: gym.id,
					userId: user.id,
				},
			],
		});

		const getCheckInsMetricsResponse = await request(app.server)
			.get(`/check-ins/metrics`)
			.set("Authorization", `Bearer ${token}`);

		expect(getCheckInsMetricsResponse.statusCode).toEqual(200);

		expect(getCheckInsMetricsResponse.body.checkInsCount).toEqual(2);
	});
});
