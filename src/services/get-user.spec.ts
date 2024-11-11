import { expect, describe, it, beforeEach } from "vitest";
import * as argon2 from "argon2";
import { InmemoryUserRepository } from "@/repositories/in-memory/in-memory-user-repository";
import { GetUserProfileService } from "./get-user-profile";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let inMemoryUsersRepository: InmemoryUserRepository;
let getUserProfileService: GetUserProfileService;

beforeEach(() => {
	inMemoryUsersRepository = new InmemoryUserRepository();
	getUserProfileService = new GetUserProfileService(inMemoryUsersRepository);
});

describe("GetUserProfile Service", () => {
	it("should be able to get user profile", async () => {
		const userProfile = await inMemoryUsersRepository.create({
			name: "Jhon Doe",
			email: "jhondoe@email.com",
			passwordHash: await argon2.hash("12345", {
				type: argon2.argon2i,
				timeCost: 3,
				parallelism: 4,
			}),
		});

		const { user } = await getUserProfileService.getUserProfile({
			userId: userProfile.id,
		});
		expect(user.name).toEqual("Jhon Doe");
	});

	it("should not be able to get user profile with wrong id", async () => {
		await expect(() =>
			getUserProfileService.getUserProfile({
				userId: "wrong-id",
			}),
		).rejects.toBeInstanceOf(ResourceNotFoundError);
	});
});
