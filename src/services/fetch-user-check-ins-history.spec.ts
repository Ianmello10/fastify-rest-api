import { expect, describe, it, beforeEach } from "vitest";
import { InmemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { FetchUserCheckInService } from "./fetch-user-check-ins-history";
let inMemoryCheckInsRepository: InmemoryCheckInsRepository;
let fetchUserCheckInService: FetchUserCheckInService;
beforeEach(async () => {
	inMemoryCheckInsRepository = new InmemoryCheckInsRepository();
	fetchUserCheckInService = new FetchUserCheckInService(
		inMemoryCheckInsRepository,
	);
});
describe("Fetch CheckIn History Service", () => {
	it("Should be able to fetch check-in history", async () => {
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

		const { checkIns } = await fetchUserCheckInService.fetchCheckInsHisotry({
			userId: "user01",
			page: 1,
		});

		expect(checkIns).toHaveLength(2);
		expect(checkIns).toEqual([
			expect.objectContaining({ gymId: "gym01" }),
			expect.objectContaining({ gymId: "gym02" }),
		]);
	});

	it("Should be able to fetch paginated  check-in history", async () => {
		for (let i = 1; i <= 22; i++) {
			await inMemoryCheckInsRepository.create({
				createdAt: new Date(),
				gymId: `gym0${i}`,
				userId: "user01",
			});
		}

		const { checkIns } = await fetchUserCheckInService.fetchCheckInsHisotry({
			userId: "user01",
			page: 2,
		});

		expect(checkIns).toHaveLength(2);
		expect(checkIns).toEqual([
			expect.objectContaining({ gymId: "gym021" }),
			expect.objectContaining({ gymId: "gym022" }),
		]);
	});
});
