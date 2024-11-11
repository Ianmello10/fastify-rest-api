import { Gym } from "@prisma/client";
import { GymsRepository } from "@/repositories/gyms-repository";

interface CreateGymServiceReq {
	title: string;
	description: string | null;
	phone: string | null;
	latitude: number;
	longitude: number;
}

interface CreateGymServiceRes {
	gym: Gym;
}

export class CreateGymService {
	constructor(private GymsRepository: GymsRepository) {}

	async createGym({
		title,
		description,
		phone,
		latitude,
		longitude,
	}: CreateGymServiceReq): Promise<CreateGymServiceRes> {
		const gym = await this.GymsRepository.create({
			title,
			description,
			phone,
			latitude,
			longitude,
		});

		return { gym };
	}
}
