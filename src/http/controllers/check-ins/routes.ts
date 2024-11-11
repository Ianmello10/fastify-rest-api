import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { checkIn } from "./create";
import { metrics } from "./metrics";
import { validate } from "./validate";
import { history } from "./history";
import { verifyRole } from "@/http/middlewares/verify-role";

export async function checkInsRoutes(app: FastifyInstance) {
	app.addHook("onRequest", verifyJWT);

	app.get("/check-ins/history", history);
	app.get("/check-ins/metrics", metrics);
	app.post("/gyms/:gymId/check-in", checkIn);
	app.patch(
		"/check-ins/:checkInId/validate",
		{ onRequest: [verifyRole("ADMIN")] },
		validate,
	);
}
