import { expect, describe, it, beforeEach } from "vitest";
import * as argon2 from "argon2";
import { InmemoryUserRepository } from "@/repositories/in-memory/in-memory-user-repository";
import { AuthenticateService } from "./authenticate";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

let inMemoryUsersRepository: InmemoryUserRepository;
let authenticateService: AuthenticateService;

beforeEach(() => {
	inMemoryUsersRepository = new InmemoryUserRepository();
	authenticateService = new AuthenticateService(inMemoryUsersRepository);
});

describe("Authenticate Service", () => {
	it("should be able to authenticate", async () => {
		await inMemoryUsersRepository.create({
			name: "John Doe2",
			email: "jhondoe43@email.com",
			passwordHash: await argon2.hash("123456", {
				type: argon2.argon2i,
				timeCost: 3,
				parallelism: 4,
			}),
		});

		const { user } = await authenticateService.auth({
			email: "jhondoe43@email.com",
			password: "123456",
		});
		expect(user.id).toEqual(expect.any(String));
	});
});

describe("Authenticate Service", () => {
	it("should not be able to authenticate with wrong email", async () => {
		await expect(() =>
			authenticateService.auth({
				email: "jhondoe43@email.com",
				password: "123456",
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});
});

describe("Authenticate Service", () => {
	it("should not be able to authenticate with wrong password", async () => {
		await inMemoryUsersRepository.create({
			name: "John Doe2",
			email: "jhondoe43@email.com",
			passwordHash: await argon2.hash("123456", {
				type: argon2.argon2i,
				timeCost: 3,
				parallelism: 4,
			}),
		});
		await expect(() =>
			authenticateService.auth({
				email: "jhondoe43@email.com",
				password: "1234568",
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});
});
