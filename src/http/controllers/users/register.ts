import { FastifyReply, FastifyRequest } from "fastify";
import { UserAlreadyExistsError } from "@/services/errors/user-already-exists-error";
import { makeRegisterService } from "@/services/factories/make-register-service";
import { registerBodySchema } from "@/schemas/user-schema";

export async function register(request: FastifyRequest, reply: FastifyReply) {
	const { name, email, password } = registerBodySchema.parse(request.body);

	try {
		// factory pattern
		const registerService = makeRegisterService();

		await registerService.register({ name, email, password });
	} catch (error) {
		if (error instanceof UserAlreadyExistsError) {
			reply.status(409).send({ message: error.message });
		}

		throw error;
	}

	return reply.status(201).send();
}
