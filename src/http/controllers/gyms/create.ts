import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { makeCreateGymService } from "@/services/factories/make-create-gym-service";

export async function create(request: FastifyRequest, reply: FastifyReply) {
	const createBodySchema = z.object({
		title: z.string(),
		description: z.string().nullable(),
		phone: z.string().nullable(),
		latitude: z.number().refine((value) => {
			return Math.abs(value) <= 90;
		}),
		longitude: z.number().refine((value) => {
			return Math.abs(value) <= 100;
		}),
	});

	const { title, description, phone, latitude, longitude } =
		createBodySchema.parse(request.body);

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
