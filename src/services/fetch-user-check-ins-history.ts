import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";

interface FetchUserCheckInsHistoryServiceReq {
	userId: string;
	page?: number;
}

interface FetchUserCheckInsHistoryServiceRes {
	checkIns: CheckIn[];
}

export class FetchUserCheckInService {
	constructor(private checkInsRepository: CheckInsRepository) {}
	async fetchCheckInsHisotry({
		userId,
		page,
	}: FetchUserCheckInsHistoryServiceReq): Promise<FetchUserCheckInsHistoryServiceRes> {
		const checkIns = await this.checkInsRepository.findManyByUserId(
			userId,
			page,
		);

		return {
			checkIns,
		};
	}
}
