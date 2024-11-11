import request from "supertest";
import { FastifyInstance } from "fastify";
import * as argon2 from "argon2";
import { prisma } from "@/lib/prisma";

export async function createAndAuthenticateUser(
	app: FastifyInstance,
	isAdmin = false,
): Promise<{ token: string }> {
	const passwordHash = await argon2.hash("123456", {
		type: argon2.argon2i,
		timeCost: 3,
		parallelism: 4,
	});

	await prisma.user.create({
		data: {
			name: "Jhon Doe",
			email: "jhondoe@email.com",
			passwordHash,
			role: isAdmin ? "ADMIN" : "MEMBER",
		},
	});

	const authResponse = await request(app.server).post("/sessions").send({
		email: "jhondoe@email.com",
		password: "123456",
	});

	const { token } = authResponse.body;

	return { token };
}
