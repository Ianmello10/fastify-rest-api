import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { SearchGymService } from "../search-gym";

export function makeSearchGymsService() {
	const gymsRepository = new PrismaGymsRepository();
	const searchGymsService = new SearchGymService(gymsRepository);

	return searchGymsService;
}
