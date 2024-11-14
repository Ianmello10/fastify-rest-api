import { FastifyReply, FastifyRequest } from "fastify";
import { InvalidCredentialsError } from "@/services/errors/invalid-credentials-error";
import { makeAuthService } from "@/services/factories/make-auth-service";
import { env } from "@/env";
import { authBodySchema } from "@/schemas/user-schema";

export async function authenticate(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { email, password } = authBodySchema.parse(request.body);

	try {
		// factory pattern
		const authenticateService = makeAuthService();

		const { user } = await authenticateService.auth({ email, password });

		const token = await reply.jwtSign(
			{
				role: user.role,
			},
			{
				sign: {
					sub: user.id,
				},
			},
		);

		const refreshToken = await reply.jwtSign(
			{
				role: user.role,
			},
			{
				sign: {
					sub: user.id,
					expiresIn: "7d",
				},
			},
		);

		return reply
			.setCookie("refreshToken", refreshToken, {
				path: "/",
				secure: env.NODE_ENV === "production",
				sameSite: true,
				httpOnly: true,
			})
			.status(200)
			.send({
				token,
			});
	} catch (error) {
		if (error instanceof InvalidCredentialsError) {
			reply.status(409).send({ message: error.message });
		}

		throw error;
	}
}
