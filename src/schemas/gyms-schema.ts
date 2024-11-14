import { Decimal } from "@prisma/client/runtime/library";
import { z } from "zod";

export const createGymBodySchema = z.object({
	title: z.string(),
	description: z.string().nullable(),
	phone: z.string().nullable(),
	latitude: z.number().refine((value) => {
		return Math.abs(value) <= 90;
	}),
	longitude: z.number().refine((value) => {
		return Math.abs(value) <= 100;
	}),
});

export const searchQuerySchema = z.object({
	query: z.string(),
	page: z.coerce.number().min(1).default(1),
});

export const responseGymBodySchema = z.object({
	gyms: z.array(
		z.object({
			title: z.string(),
			description: z.string().nullable(),
			phone: z.string().nullable(),
			latitude: z.instanceof(Decimal).transform((val) => val.toNumber()),
			longitude: z.instanceof(Decimal).transform((val) => val.toNumber()),
		}),
	),
});

export const fetchBodySchema = z.object({
	latitude: z.coerce.number().refine((value) => {
		return Math.abs(value) <= 90;
	}),
	longitude: z.coerce.number().refine((value) => {
		return Math.abs(value) <= 100;
	}),
});
