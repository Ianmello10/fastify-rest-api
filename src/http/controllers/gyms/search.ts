import { FastifyReply, FastifyRequest } from "fastify";
import { makeSearchGymsService } from "@/services/factories/make-search-gym-service";
import { searchQuerySchema } from "@/schemas/gyms-schema";

export async function search(request: FastifyRequest, reply: FastifyReply) {
	const { query, page } = searchQuerySchema.parse(request.query);

	// factory patte
	const searchGymsService = makeSearchGymsService();

	const { gyms } = await searchGymsService.searchGym({
		query,
		page,
	});

	return reply.status(200).send({
		gyms,
	});
}
