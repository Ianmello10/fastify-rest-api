import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { makeCheckInService } from "@/services/factories/make-check-in-service";

export async function checkIn(request: FastifyRequest, reply: FastifyReply) {
	const createCheckInBodySchema = z.object({
		gymId: z.string().uuid(),
	});

	const checkInBodySchema = z.object({
		latitude: z.number().refine((value) => {
			return Math.abs(value) <= 90;
		}),
		longitude: z.number().refine((value) => {
			return Math.abs(value) <= 100;
		}),
	});

	const { latitude, longitude } = checkInBodySchema.parse(request.body);
	const { gymId } = createCheckInBodySchema.parse(request.params);

	// factory pattern

	const checkInService = makeCheckInService();
	await checkInService.createCheckIn({
		gymId,
		userId: request.user.sub,
		userLatitude: latitude,
		userLongitude: longitude,
	});

	return reply.status(201).send();
}
