import { FastifyReply, FastifyRequest } from "fastify";
import { makeGetUserMetricService } from "@/services/factories/make-get-user-metrics-service";

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
	// factory pattern

	const metricsCheckInsService = makeGetUserMetricService();

	const { checkInsCount } = await metricsCheckInsService.getUserMetrics({
		userId: request.user.sub,
	});

	return reply.status(200).send({
		checkInsCount,
	});
}
