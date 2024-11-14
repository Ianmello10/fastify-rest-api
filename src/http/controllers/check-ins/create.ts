import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { makeCheckInService } from "@/services/factories/make-check-in-service";
import {
	checkInBodySchema,
	createCheckInBodySchema,
} from "@/schemas/check-in-schema";

export async function checkIn(request: FastifyRequest, reply: FastifyReply) {
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
