import { z } from "zod";

export const checkInBodySchema = z.object({
	latitude: z.number().refine((value) => {
		return Math.abs(value) <= 90;
	}),
	longitude: z.number().refine((value) => {
		return Math.abs(value) <= 100;
	}),
});

export const createCheckInBodySchema = z.object({
	gymId: z.string().uuid(),
});

export const validateCheckInSchema = z.object({
	checkInId: z.string().uuid(),
});

export const gymIdSchema = z.object({
	gymId: z.string().uuid(),
});

export const checkInsCountSchema = z.object({
	checkInsCount: z.number(),
});

export const checkInshistoryBodySchema = z.object({
	page: z.coerce.number().min(1).default(1),
});

export const checkInsHistorySchema = z.object({
	checkIns: z.array(
		z.object({
			gymId: z.string(),
			id: z.string(),
			createdAt: z.date(),
			validatedAt: z.date().nullable(),
			userId: z.string(),
		}),
	),
});
