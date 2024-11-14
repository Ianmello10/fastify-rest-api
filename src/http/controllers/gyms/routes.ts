import { FastifyInstance } from "fastify";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { search } from "./search";
import { fetchNearby } from "./nearby";
import { create } from "./create";
import { verifyRole } from "@/http/middlewares/verify-role";
import {
	createGymBodySchema,
	fetchBodySchema,
	responseGymBodySchema,
	searchQuerySchema,
} from "@/schemas/gyms-schema";

export async function gymsRoutes(app: FastifyInstance) {
	app.addHook("onRequest", verifyJWT);

	app.get(
		"/gyms/search",
		{
			schema: {
				security: [{ BearerAuth: [] }],
				tags: ["gyms"],
				querystring: searchQuerySchema,
				response: { 200: responseGymBodySchema },
			},
		},
		search,
	);
	app.get(
		"/gyms/nearby",
		{
			schema: {
				security: [{ BearerAuth: [] }],
				tags: ["gyms"],
				querystring: fetchBodySchema,
				response: { 200: responseGymBodySchema },
			},
		},
		fetchNearby,
	);
	app.post(
		"/gyms",

		{
			schema: {
				security: [{ BearerAuth: [] }],
				tags: ["gyms"],
				body: createGymBodySchema,
			},
			onRequest: [verifyRole("ADMIN")],
		},
		create,
	);
}
