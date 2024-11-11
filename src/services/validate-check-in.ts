import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import dayjs from "dayjs";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";
interface validateCheckInServiceReq {
	checkInId: string;
}

interface validateCheckInServiceRes {
	checkIn: CheckIn;
}
export class ValidateCheckInService {
	constructor(private checkInsRepository: CheckInsRepository) {}

	async validateCheckIn({
		checkInId,
	}: validateCheckInServiceReq): Promise<validateCheckInServiceRes> {
		const checkIn = await this.checkInsRepository.findById(checkInId);

		if (!checkIn) {
			throw new ResourceNotFoundError();
		}

		const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
			checkIn.createdAt,
			"minutes",
		);

		if (distanceInMinutesFromCheckInCreation > 20) {
			throw new LateCheckInValidationError();
		}

		checkIn.validatedAt = new Date();

		await this.checkInsRepository.save(checkIn);

		return {
			checkIn,
		};
	}
}
