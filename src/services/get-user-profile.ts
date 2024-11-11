import { UsersRepository } from "@/repositories/user-repositories";
import { User } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface GetUserProfileServiceReq {
	userId: string;
}

interface GetUserProfileServiceRes {
	user: User;
}

export class GetUserProfileService {
	constructor(private usersRepository: UsersRepository) {}

	async getUserProfile({
		userId,
	}: GetUserProfileServiceReq): Promise<GetUserProfileServiceRes> {
		const user = await this.usersRepository.findById(userId);
		if (!user) {
			throw new ResourceNotFoundError();
		}

		return { user };
	}
}
