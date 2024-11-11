import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { makeFetchNearbyGymsService } from "@/services/factories/make-fetch-nearby-gym-service";

export async function fetchNearby(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const fetchBodySchema = z.object({
		latitude: z.coerce.number().refine((value) => {
			return Math.abs(value) <= 90;
		}),
		longitude: z.coerce.number().refine((value) => {
			return Math.abs(value) <= 100;
		}),
	});

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
