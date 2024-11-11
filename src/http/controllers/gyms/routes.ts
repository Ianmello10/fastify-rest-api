import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { search } from "./search";
import { fetchNearby } from "./nearby";
import { create } from "./create";
import { verifyRole } from "@/http/middlewares/verify-role";

export async function gymsRoutes(app: FastifyInstance) {
	app.addHook("onRequest", verifyJWT);

	app.get("/gyms/search", search);
	app.get("/gyms/nearby", fetchNearby);
	app.post("/gyms", { onRequest: [verifyRole("ADMIN")] }, create);
}
