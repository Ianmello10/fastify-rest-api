import { Gym } from "@prisma/client";
import { GymsRepository } from "@/repositories/gyms-repository";

interface FetchNearbyGymsReq {
	userLatitude: number;
	userLongitude: number;
}

interface FetchNearbyGymsRes {
	gyms: Gym[];
}

export class FetchNearbyGymService {
	constructor(private GymsRepository: GymsRepository) {}

	async searchNearbyGym({
		userLatitude,
		userLongitude,
	}: FetchNearbyGymsReq): Promise<FetchNearbyGymsRes> {
		const gyms = await this.GymsRepository.findManyNearby({
			latitude: userLatitude,
			longitude: userLongitude,
		});

		return {
			gyms,
		};
	}
}
