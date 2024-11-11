import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { makeValidateCheckInService } from "@/services/factories/make-validate-check-in-service";

export async function validate(request: FastifyRequest, reply: FastifyReply) {
	const checkInIdBodySchema = z.object({
		checkInId: z.string().uuid(),
	});

	const { checkInId } = checkInIdBodySchema.parse(request.params);

	// factory pattern

	const validateCheckInService = makeValidateCheckInService();

	await validateCheckInService.validateCheckIn({
		checkInId,
	});

	return reply.status(204).send();
}
