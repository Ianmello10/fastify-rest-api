import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { FetchNearbyGymService } from "../fetch-nearby-gyms";

export function makeFetchNearbyGymsService() {
	const gymsRepository = new PrismaGymsRepository();
	const fetchNearbyGymsService = new FetchNearbyGymService(gymsRepository);

	return fetchNearbyGymsService;
}
