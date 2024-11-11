import { FetchUserCheckInService } from "../fetch-user-check-ins-history";
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-in-repository";

export function makeFetchUserCheckInHistoryService() {
	const checkInsRepository = new PrismaCheckInsRepository();
	const fetchCheckInHistoryService = new FetchUserCheckInService(
		checkInsRepository,
	);

	return fetchCheckInHistoryService;
}
