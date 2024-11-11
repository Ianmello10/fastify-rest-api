import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { InmemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { ValidateCheckInService } from "./validate-check-in";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";

let inMemoryCheckInsRepository: InmemoryCheckInsRepository;
let validateCheckInService: ValidateCheckInService;
beforeEach(async () => {
	inMemoryCheckInsRepository = new InmemoryCheckInsRepository();
	validateCheckInService = new ValidateCheckInService(
		inMemoryCheckInsRepository,
	);
	vi.useFakeTimers();
});

afterEach(() => {
	vi.useRealTimers();
});

describe("Validate CheckIn Service", () => {
	it("Should be able to validate check-in", async () => {
		const createdCheckIn = await inMemoryCheckInsRepository.create({
			gymId: "gym01",
			userId: "user01",
		});

		const { checkIn } = await validateCheckInService.validateCheckIn({
			checkInId: createdCheckIn.id,
		});

		expect(checkIn.validatedAt).toEqual(expect.any(Date));
		expect(inMemoryCheckInsRepository.items[0].validatedAt).toEqual(
			expect.any(Date),
		);
	});

	it("Should not be able to validate an inexistent check-in", async () => {
		await expect(() =>
			validateCheckInService.validateCheckIn({
				checkInId: "inexistent",
			}),
		).rejects.toBeInstanceOf(ResourceNotFoundError);
	});

	it("Should not be able to validate the check-in after 20 minutes of its creation", async () => {
		vi.setSystemTime(new Date(2023, 0, 1, 13, 40));
		const createdCheckIn = await inMemoryCheckInsRepository.create({
			gymId: "gym01",
			userId: "user01",
		});

		const twentyOneMinutesInMs = 1000 * 60 * 21;
		vi.advanceTimersByTime(twentyOneMinutesInMs);

		await expect(() =>
			validateCheckInService.validateCheckIn({
				checkInId: createdCheckIn.id,
			}),
		).rejects.toBeInstanceOf(LateCheckInValidationError);
	});
});
