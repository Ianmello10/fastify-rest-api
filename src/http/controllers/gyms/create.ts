import { FastifyReply, FastifyRequest } from "fastify";
import { makeCreateGymService } from "@/services/factories/make-create-gym-service";
import { createGymBodySchema } from "@/schemas/gyms-schema";

export async function create(request: FastifyRequest, reply: FastifyReply) {
	const { title, description, phone, latitude, longitude } =
		createGymBodySchema.parse(request.body);

	// factory pattern
	const createService = makeCreateGymService();

	await createService.createGym({
		title,
		description,
		phone,
		latitude,
		longitude,
	});

	return reply.status(201).send();
}
