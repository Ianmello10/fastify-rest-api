import { test, expect, describe, it, beforeEach } from "vitest";
import { InmemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { CreateGymService } from "./create-gym";

let inMemoryGymRepository: InmemoryGymsRepository;
let createGymService: CreateGymService;
beforeEach(() => {
	inMemoryGymRepository = new InmemoryGymsRepository();
	createGymService = new CreateGymService(inMemoryGymRepository);
});

describe("Register Service", () => {
	it("Should be able to create a gym", async () => {
		const { gym } = await createGymService.createGym({
			title: "Strong Gym",
			description: "Strong is a great place to workout",
			phone: "(11) 99999-9999",
			latitude: -27.2092052,
			longitude: -49.6401091,
		});
		expect(gym.id).toEqual(expect.any(String));
	});
});
