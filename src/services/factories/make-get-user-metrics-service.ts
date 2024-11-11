import { GetUserMetricsService } from "../get-user-metrics";
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-in-repository";

export function makeGetUserMetricService() {
	const checkInsRepository = new PrismaCheckInsRepository();
	const getUserMetricsService = new GetUserMetricsService(checkInsRepository);

	return getUserMetricsService;
}
