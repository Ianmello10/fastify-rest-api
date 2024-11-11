import { expect, describe, it, beforeEach } from "vitest";
import { InmemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { FetchNearbyGymService } from "./fetch-nearby-gyms";
let inMemoryGymsRepository: InmemoryGymsRepository;
let fetchNearbyGymService: FetchNearbyGymService;
beforeEach(async () => {
	inMemoryGymsRepository = new InmemoryGymsRepository();
	fetchNearbyGymService = new FetchNearbyGymService(inMemoryGymsRepository);
});
describe("Fetch Nearby Gyms Searvice Service", () => {
	it("Should be able to fetch nearby gyms", async () => {
		await inMemoryGymsRepository.create({
			title: "Near Gym",
			description: null,
			phone: null,
			latitude: -27.2092052,
			longitude: -49.6401091,
		});

		await inMemoryGymsRepository.create({
			title: "Far Gym",
			description: null,
			phone: null,
			latitude: -23.4946043,
			longitude: -47.457271,
		});

		const { gyms } = await fetchNearbyGymService.searchNearbyGym({
			userLatitude: -27.2092052,
			userLongitude: -49.6401091,
		});
		expect(gyms).toHaveLength(1);
		expect(gyms).toEqual([expect.objectContaining({ title: "Near Gym" })]);
	});
});
