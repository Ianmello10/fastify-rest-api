import * as argon2 from "argon2";
import { UsersRepository } from "@/repositories/user-repositories";
import { UserAlreadyExistsError } from "@/services/errors/user-already-exists-error";
import { User } from "@prisma/client";

interface RegisterServiceReq {
	name: string;
	email: string;
	password: string;
}

interface RegisterServiceRes {
	user: User;
}

export class RegisterService {
	constructor(private usersRepository: UsersRepository) {}

	async register({
		name,
		email,
		password,
	}: RegisterServiceReq): Promise<RegisterServiceRes> {
		const passwordHash = await argon2.hash(password, {
			type: argon2.argon2i,
			timeCost: 3,
			parallelism: 4,
		});

		const userAlreadyExists = await this.usersRepository.findByEmail(email);

		if (userAlreadyExists) {
			throw new UserAlreadyExistsError();
		}

		const user = await this.usersRepository.create({
			name,
			email,
			passwordHash,
		});

		return { user };
	}
}
