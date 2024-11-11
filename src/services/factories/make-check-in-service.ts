import { CheckInService } from "../checkin";
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-in-repository";

export function makeCheckInService() {
	const checkInsRepository = new PrismaCheckInsRepository();
	const gymsRepository = new PrismaGymsRepository();
	const checkInService = new CheckInService(checkInsRepository, gymsRepository);

	return checkInService;
}
