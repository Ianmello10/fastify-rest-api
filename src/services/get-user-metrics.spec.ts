import { expect, describe, it, beforeEach } from "vitest";
import { InmemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { GetUserMetricsService } from "./get-user-metrics";
let inMemoryCheckInsRepository: InmemoryCheckInsRepository;
let getUserMetricsService: GetUserMetricsService;
beforeEach(async () => {
	inMemoryCheckInsRepository = new InmemoryCheckInsRepository();
	getUserMetricsService = new GetUserMetricsService(inMemoryCheckInsRepository);
});
describe("Get user metrics Service", () => {
	it("Should be able to get check-ins count from metrics", async () => {
		await inMemoryCheckInsRepository.create({
			id: "checkin01",
			createdAt: new Date(),
			gymId: "gym01",
			userId: "user01",
		});

		await inMemoryCheckInsRepository.create({
			id: "checkin02",
			createdAt: new Date(),
			gymId: "gym02",
			userId: "user01",
		});

		const { checkInsCount } = await getUserMetricsService.getUserMetrics({
			userId: "user01",
		});
		expect(checkInsCount).toEqual(2);
	});
});
