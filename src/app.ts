import fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import { usersRoutes } from "@/http/controllers/users/routes";
import { ZodError } from "zod";
import { env } from "./env/index";
import { fastifyJwt } from "@fastify/jwt";
import { gymsRoutes } from "@/http/controllers/gyms/routes";
import { checkInsRoutes } from "./http/controllers/check-ins/routes";
import { fastifySwagger } from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	ZodTypeProvider,
} from "fastify-type-provider-zod";

export const app = fastify().withTypeProvider<ZodTypeProvider>();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
	openapi: {
		servers: [
			{
				url: "http://localhost:3333",
			},
		],

		components: {
			securitySchemes: {
				BearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
		},
		info: {
			title: "Fastify API",
			description: "Fastify API for GymPass",
			version: "0.1.0",
		},
	},
	transform: jsonSchemaTransform,
	prefix: "/docs",
});
app.register(fastifySwaggerUi, {
	routePrefix: "/docs",
	staticCSP: true,
	transformStaticCSP: (header) => header,
	transformSpecification: (swaggerObject) => swaggerObject,
	transformSpecificationClone: true,
});

app.register(fastifyCookie);
app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
	cookie: {
		cookieName: "refreshToken",
		signed: false,
	},
	sign: {
		expiresIn: "10m",
	},
});
app.register(usersRoutes);
app.register(gymsRoutes);
app.register(checkInsRoutes);
app.setErrorHandler((error, _, reply) => {
	if (error instanceof ZodError) {
		return reply.status(400).send({
			message: "Validation error",
			issues: error.format(),
		});
	}

	if (env.NODE_ENV !== "production") {
		console.error(error);
	} else {
		// TODO: Here we should log to an external tool like DataDog/NewRelic/Sentry
		// See https://github.com/fastify/fastify-sensible
	}

	return reply.status(500).send({
		message: "Internal server error",
	});
});
