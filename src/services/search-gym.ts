import { Gym } from "@prisma/client";
import { GymsRepository } from "@/repositories/gyms-repository";

interface SearchGymServiceReq {
	query: string;
	page: number;
}

interface SearchGymServiceRes {
	gyms: Gym[];
}

export class SearchGymService {
	constructor(private GymsRepository: GymsRepository) {}

	async searchGym({
		query,
		page,
	}: SearchGymServiceReq): Promise<SearchGymServiceRes> {
		const gyms = await this.GymsRepository.searchMany(query, page);

		return { gyms };
	}
}
