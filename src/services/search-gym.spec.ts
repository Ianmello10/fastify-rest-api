import { expect, describe, it, beforeEach } from "vitest";
import { InmemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { SearchGymService } from "./search-gym";
let inMemoryGymsRepository: InmemoryGymsRepository;
let searchGymService: SearchGymService;
beforeEach(async () => {
	inMemoryGymsRepository = new InmemoryGymsRepository();
	searchGymService = new SearchGymService(inMemoryGymsRepository);
});
describe("Search Gym Searvice Service", () => {
	it("Should be able to search for gyms", async () => {
		await inMemoryGymsRepository.create({
			title: "Javascript Gym",
			description: null,
			phone: null,
			latitude: -27.2092052,
			longitude: -49.6401091,
		});

		await inMemoryGymsRepository.create({
			title: "Typescript Gym",
			description: null,
			phone: null,
			latitude: -27.2092052,
			longitude: -49.6401091,
		});

		const { gyms } = await searchGymService.searchGym({
			query: "Javascript Gym",
			page: 1,
		});

		expect(gyms).toHaveLength(1);
		expect(gyms).toEqual([
			expect.objectContaining({ title: "Javascript Gym" }),
		]);
	});

	it("Should be able to fetch paginated gyms search", async () => {
		for (let i = 1; i <= 22; i++) {
			await inMemoryGymsRepository.create({
				title: `Javascript Gym ${i}`,
				description: null,
				phone: null,
				latitude: -27.2092052,
				longitude: -49.6401091,
			});
		}

		const { gyms } = await searchGymService.searchGym({
			query: "Javascript Gym",
			page: 2,
		});

		expect(gyms).toHaveLength(2);
		expect(gyms).toEqual([
			expect.objectContaining({ title: "Javascript Gym 21" }),
			expect.objectContaining({ title: "Javascript Gym 22" }),
		]);
	});
});
