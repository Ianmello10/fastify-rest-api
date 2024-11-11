import { test, expect, describe, it, beforeEach } from "vitest";
import { RegisterService } from "./register";
import * as argon2 from "argon2";
import { InmemoryUserRepository } from "@/repositories/in-memory/in-memory-user-repository";
import { UserAlreadyExistsError } from "@/services/errors/user-already-exists-error";

let inMemoryUsersRepository: InmemoryUserRepository;
let registerService: RegisterService;
beforeEach(() => {
	inMemoryUsersRepository = new InmemoryUserRepository();
	registerService = new RegisterService(inMemoryUsersRepository);
});

describe("Register Service", () => {
	it("Should be create a user", async () => {
		const { user } = await registerService.register({
			name: "John Doe",
			email: "jhondoe@email.com",
			password: "123456",
		});
		expect(user.id).toEqual(expect.any(String));
	});

	it("Should be able hash user password", async () => {
		const { user } = await registerService.register({
			name: "John Doe",
			email: "jhondoe@email.com",
			password: "123456",
		});

		const isPasswordCorrectlyHashed = await argon2.verify(
			user.passwordHash,
			"123456",
		);

		expect(isPasswordCorrectlyHashed).toBe(true);
	});

	it("Should  not be able to create user with same email", async () => {
		const email = "jhondoe22@email.com";

		await registerService.register({
			name: "John Doe",
			email: email,
			password: "123456",
		});

		await expect(() =>
			registerService.register({
				name: "Jhon Doe",
				email,
				password: "123456",
			}),
		).rejects.toBeInstanceOf(UserAlreadyExistsError);
	});
});
