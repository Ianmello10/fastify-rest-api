import { AuthenticateService } from "../authenticate";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";

export function makeAuthService() {
	const usersRepository = new PrismaUsersRepository();
	const authenticateService = new AuthenticateService(usersRepository);

	return authenticateService;
}
