import { UsersRepository } from "@/repositories/user-repositories";
import { InvalidCredentialsError } from "@/services/errors/invalid-credentials-error";
import * as argon2 from "argon2";
import { User } from "@prisma/client";

interface AuthenticateServiceReq {
	email: string;
	password: string;
}

interface AuthenticateServiceRes {
	user: User;
}

export class AuthenticateService {
	constructor(private usersRepository: UsersRepository) {}

	async auth({
		email,
		password,
	}: AuthenticateServiceReq): Promise<AuthenticateServiceRes> {
		const user = await this.usersRepository.findByEmail(email);
		if (!user) {
			throw new InvalidCredentialsError();
		}

		const doesPasswordMatches = await argon2.verify(
			user.passwordHash,
			password,
		);
		if (!doesPasswordMatches) {
			throw new InvalidCredentialsError();
		}
		return { user };
	}
}
