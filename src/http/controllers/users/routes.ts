import { FastifyInstance } from "fastify";
import { register } from "./register";
import { authenticate } from "./authenticate";
import { profile } from "./profile";
import { verifyJWT } from "@/http/middlewares/verify-jwt";
import { refresh } from "./refresh";
import {
	authBodySchema,
	profileResponseSchema,
	registerBodySchema,
	tokenSchema,
} from "@/schemas/user-schema";

export async function usersRoutes(app: FastifyInstance) {
	app.post(
		"/users",
		{
			schema: { tags: ["users"], body: registerBodySchema },
		},
		register,
	);

	app.post(
		"/sessions",
		{
			schema: {
				tags: ["users"],
				body: authBodySchema,
				response: { 200: tokenSchema },
			},
		},
		authenticate,
	);

	app.patch(
		"/token/refresh",

		{
			schema: {
				tags: ["users"],
				response: { 200: tokenSchema },
			},
		},
		refresh,
	);
	/** Authenticate */
	app.get(
		"/me",
		{
			onRequest: [verifyJWT],
			schema: {
				tags: ["users"],
				security: [{ BearerAuth: [] }],
				response: { 200: profileResponseSchema },
			},
		},
		profile,
	);
}
