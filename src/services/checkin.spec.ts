import { test, expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { CheckInService } from "./checkin";
import { InmemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { InmemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";

let inMemoryCheckInsRepository: InmemoryCheckInsRepository;
let gymsRepository: InmemoryGymsRepository;
let checkInService: CheckInService;
beforeEach(async () => {
	inMemoryCheckInsRepository = new InmemoryCheckInsRepository();
	gymsRepository = new InmemoryGymsRepository();
	checkInService = new CheckInService(
		inMemoryCheckInsRepository,
		gymsRepository,
	);

	await gymsRepository.create({
		id: "gym01",
		title: "Strong Gym",
		description: "Strong is a great place to workout",
		phone: "(11) 99999-9999",
		latitude: -23.5595934,
		longitude: -46.179941,
	});

	vi.useFakeTimers();
});

afterEach(() => {
	vi.useRealTimers();
});

describe("CheckIn Service", () => {
	it("Should be able to check in", async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

		const { checkIn } = await checkInService.createCheckIn({
			userId: "user01",
			gymId: "gym01",
			userLatitude: -23.5595934,
			userLongitude: -46.179941,
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	it("Should not be able to check-in twice in the same day", async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));
		await checkInService.createCheckIn({
			userId: "user01",
			gymId: "gym01",
			userLatitude: -23.5595934,
			userLongitude: -46.179941,
		});

		await expect(() =>
			checkInService.createCheckIn({
				userId: "user01",
				gymId: "gym01",
				userLatitude: -23.5595934,
				userLongitude: -46.179941,
			}),
		).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
	});

	it("Should  be able to check-in twice but in different days", async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));
		await checkInService.createCheckIn({
			userId: "user01",
			gymId: "gym01",
			userLatitude: -23.5595934,
			userLongitude: -46.179941,
		});
		vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

		const { checkIn } = await checkInService.createCheckIn({
			userId: "user01",
			gymId: "gym01",
			userLatitude: -23.5595934,
			userLongitude: -46.179941,
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	it("should not be able to check in on distant gym", async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

		gymsRepository.items.push({
			id: "gym02",
			title: "Strong Gym",
			description: null,
			phone: null,
			latitude: new Decimal(-23.5595934),
			longitude: new Decimal(-46.179941),
		});

		await expect(() =>
			checkInService.createCheckIn({
				userId: "user01",
				gymId: "gym02",
				userLatitude: -23.5542647,
				userLongitude: -46.1898044,
			}),
		).rejects.toBeInstanceOf(MaxDistanceError);
	});
});
