import { RegisterService } from "../register";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";

//Patern of factory
export function makeRegisterService() {
	// Inversion of dependency in this two variables
	const usersRepository = new PrismaUsersRepository();
	const registerService = new RegisterService(usersRepository);

	return registerService;
}
