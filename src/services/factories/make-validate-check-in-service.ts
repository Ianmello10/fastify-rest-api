import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-in-repository";
import { ValidateCheckInService } from "../validate-check-in";

export function makeValidateCheckInService() {
	const checkInsRepository = new PrismaCheckInsRepository();
	const validateCheckInService = new ValidateCheckInService(checkInsRepository);

	return validateCheckInService;
}
