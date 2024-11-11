import { makeGetkeUserProfileService } from "@/services/factories/make-get-user-profile-service";
import { FastifyReply, FastifyRequest } from "fastify";

export async function profile(request: FastifyRequest, reply: FastifyReply) {
	const getUserProfile = makeGetkeUserProfileService();

	const { user } = await getUserProfile.getUserProfile({
		userId: request.user.sub,
	});

	const user_ = user;
	const { passwordHash: _, ...userParsed } = user_;

	return reply.status(200).send({
		user: userParsed,
	});
}
