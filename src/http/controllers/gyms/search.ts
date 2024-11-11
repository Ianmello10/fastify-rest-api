import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { makeSearchGymsService } from "@/services/factories/make-search-gym-service";

export async function search(request: FastifyRequest, reply: FastifyReply) {
	const searchBodySchema = z.object({
		query: z.string(),
		page: z.coerce.number().min(1).default(1),
	});

	const { query, page } = searchBodySchema.parse(request.query);

	// factory patte
	const searchGymsService = makeSearchGymsService();

	const { gyms } = await searchGymsService.searchGym({
		query,
		page,
	});

	return reply.status(201).send({
		gyms,
	});
}
