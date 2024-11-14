import { FastifyReply, FastifyRequest } from "fastify";
import { makeFetchNearbyGymsService } from "@/services/factories/make-fetch-nearby-gym-service";
import { fetchBodySchema } from "@/schemas/gyms-schema";

export async function fetchNearby(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { latitude, longitude } = fetchBodySchema.parse(request.query);

	// factory pattern

	const fetchNearbyGymsService = makeFetchNearbyGymsService();

	const { gyms } = await fetchNearbyGymsService.searchNearbyGym({
		userLatitude: latitude,
		userLongitude: longitude,
	});

	return reply.status(200).send({
		gyms,
	});
}
