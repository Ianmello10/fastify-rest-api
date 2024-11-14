import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { checkIn } from "./create";
import { metrics } from "./metrics";
import { validate } from "./validate";
import { history } from "./history";
import { verifyRole } from "@/http/middlewares/verify-role";
import {
	checkInBodySchema,
	checkInsCountSchema,
	checkInshistoryBodySchema,
	checkInsHistorySchema,
	createCheckInBodySchema,
	validateCheckInSchema,
} from "@/schemas/check-in-schema";

export async function checkInsRoutes(app: FastifyInstance) {
	app.addHook("onRequest", verifyJWT);

	app.get(
		"/check-ins/history",
		{
			schema: {
				tags: ["check-ins"],
				response: { 200: checkInsHistorySchema },
				security: [{ BearerAuth: [] }],
				querystring: checkInshistoryBodySchema,
			},
		},
		history,
	);
	app.get(
		"/check-ins/metrics",
		{
			schema: {
				tags: ["check-ins"],

				security: [{ BearerAuth: [] }],
				response: { 200: checkInsCountSchema },
			},
		},
		metrics,
	);
	app.post(
		"/gyms/:gymId/check-in",
		{
			schema: {
				tags: ["check-ins"],

				security: [{ BearerAuth: [] }],
				body: checkInBodySchema,
				params: createCheckInBodySchema,
			},
		},
		checkIn,
	);
	app.patch(
		"/check-ins/:checkInId/validate",
		{
			onRequest: [verifyRole("ADMIN")],
			schema: {
				tags: ["check-ins"],

				security: [{ BearerAuth: [] }],
				params: validateCheckInSchema,
			},
		},
		validate,
	);
}
