import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { makeFetchUserCheckInHistoryService } from "@/services/factories/make-fetch-user-check-in-history-service";

export async function history(request: FastifyRequest, reply: FastifyReply) {
	const checkInshistoryBodySchema = z.object({
		page: z.coerce.number().min(1).default(1),
	});

	const { page } = checkInshistoryBodySchema.parse(request.query);

	// factory pattern

	const historyCheckInService = makeFetchUserCheckInHistoryService();

	const { checkIns } = await historyCheckInService.fetchCheckInsHisotry({
		userId: request.user.sub,
		page,
	});

	return reply.status(200).send({
		checkIns,
	});
}
