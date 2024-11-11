import { app } from "@/app";
import request from "supertest";
import { describe, it, test, expect, beforeAll, afterAll } from "vitest";
import { createAndAuthenticateUser } from "@/services/utils/test/create-and-authenticate-user";

describe("Profile Controller(e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should be able to get user profile", async () => {
		const { token } = await createAndAuthenticateUser(app);

		const profileResponse = await request(app.server)
			.get("/me")
			.set("Authorization", `Bearer ${token}`)
			.send();

		expect(profileResponse.statusCode).toEqual(200);
		expect(profileResponse.body.user).toEqual(
			expect.objectContaining({
				email: "jhondoe@email.com",
			}),
		);
	});
});