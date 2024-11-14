import { FastifyReply, FastifyRequest } from "fastify";
import { makeFetchUserCheckInHistoryService } from "@/services/factories/make-fetch-user-check-in-history-service";
import { checkInshistoryBodySchema } from "@/schemas/check-in-schema";

export async function history(request: FastifyRequest, reply: FastifyReply) {
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
