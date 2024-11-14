import { z } from "zod";

export const registerBodySchema = z.object({
	name: z.string(),
	email: z.string().email(),
	password: z.string().min(3),
});

export const authBodySchema = z.object({
	email: z.string().email(),
	password: z.string().min(3),
});

export const tokenSchema = z.object({
	token: z.string(),
});

export const profileResponseSchema = z.object({
	user: z.object({
		name: z.string(),
		email: z.string().email(),
		id: z.string(),
		role: z.enum(["ADMIN", "MEMBER"]),
		createdAt: z.date(),
	}),
});
