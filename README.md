# Rest api built with fastify and prisma

This repository aims to build an API based on SOLID principles.

## Repository Pattern  

- We use a repository pattern to define our contract with the database.

    The following code represents all methods and operations needed for the database:

```ts

import { Prisma, User } from "@prisma/client";

export interface UsersRepository {
	findByEmail(email: string): Promise<User | null>;
	create(data: Prisma.UserCreateInput): Promise<User>;
	findById(userId: string): Promise<User | null>;
} 

```

- The interface allows us to implement all the methods and operations for our PrismaUserRepository class
so we have a contract now all the operations depend on the interface this abstracts the database from our business logic you will see later 
```ts 
export class PrismaUsersRepository implements UsersRepository {
	async findByEmail(email: string) {
		const user = await prisma.user.findUnique({
			where: {
				email,
			},
		});

		return user;
	}

	async findById(userId: string) {
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		});
		return user;
	}

	async create(data: Prisma.UserCreateInput) {
		const user = await prisma.user.create({
			data,
		});

		return user;
	}
}

``` 


- We can also implement the interface to an in-memory database, decoupled from the real database. I decided to keep the types to improve the developer experience. This allows future changes to the database or ORM without affecting the rest of the application. This also allows unit testing of business rules.
  
```ts 
import { Prisma, Role, User } from "@prisma/client";
import { UsersRepository } from "../user-repositories";
import { randomUUID } from "node:crypto";

export class InmemoryUserRepository implements UsersRepository {
	public items: User[] = [];

	async findByEmail(email: string) {
		const user = this.items.find((item) => item.email === email);
		if (!user) {
			return null;
		}
		return user;
	}

	async findById(userId: string): Promise<User | null> {
		const user = this.items.find((item) => item.id === userId);
		if (!user) {
			return null;
		}

		return user;
	}

	async create(data: Prisma.UserCreateInput):Promise<User> {
		const user = {
			id: randomUUID(),
			name: data.name,
			email: data.email,
            role: data.role ?? "MEMBER",
			passwordHash: data.passwordHash,
			createdAt: new Date(),
		};

		this.items.push(user);
		return user;
	}
}

``` 
## Service Layer

- Now that the repository is implemented, we can create the service layer for business rules. By applying dependency inversion, the repository is instantiated in the constructor, abstracting the database implementation. This ensures that the service logic remains testable without touching the real database.

```ts
import * as argon2 from "argon2";
import { UsersRepository } from "@/repositories/user-repositories";
import { UserAlreadyExistsError } from "@/services/errors/user-already-exists-error";
import { User } from "@prisma/client";

interface RegisterServiceReq {
	name: string;
	email: string;
	password: string;
}

interface RegisterServiceRes {
	user: User;
}

export class RegisterService {
	constructor(private usersRepository: UsersRepository) {}

	async register({
		name,
		email,
		password,
	}: RegisterServiceReq): Promise<RegisterServiceRes> {
		const passwordHash = await argon2.hash(password, {
			type: argon2.argon2i,
			timeCost: 3,
			parallelism: 4,
		});

		const userAlreadyExists = await this.usersRepository.findByEmail(email);

		if (userAlreadyExists) {
			throw new UserAlreadyExistsError();
		}

		const user = await this.usersRepository.create({
			name,
			email,
			passwordHash,
		});

		return { user };
	}
}

```

## Unit Testing 

- We can inject the in-memory repository into the service layer to test business rules without interacting with the real database.

```ts 
import { test, expect, describe, it, beforeEach } from "vitest";
import { RegisterService } from "./register";
import * as argon2 from "argon2";
import { InmemoryUserRepository } from "@/repositories/in-memory/in-memory-user-repository";
import { UserAlreadyExistsError } from "@/services/errors/user-already-exists-error";

let inMemoryUsersRepository: InmemoryUserRepository;
let registerService: RegisterService;
beforeEach(() => {
	inMemoryUsersRepository = new InmemoryUserRepository();
	registerService = new RegisterService(inMemoryUsersRepository);
});

describe("Register Service", () => {
	it("Should be create a user", async () => {
		const { user } = await registerService.register({
			name: "John Doe",
			email: "jhondoe@email.com",
			password: "123456",
		});
		expect(user.id).toEqual(expect.any(String));
	});

	it("Should be able hash user password", async () => {
		const { user } = await registerService.register({
			name: "John Doe",
			email: "jhondoe@email.com",
			password: "123456",
		});

		const isPasswordCorrectlyHashed = await argon2.verify(
			user.passwordHash,
			"123456",
		);

		expect(isPasswordCorrectlyHashed).toBe(true);
	});

	it("Should  not be able to create user with same email", async () => {
		const email = "jhondoe22@email.com";

		await registerService.register({
			name: "John Doe",
			email: email,
			password: "123456",
		});

		await expect(() =>
			registerService.register({
				name: "Jhon Doe",
				email,
				password: "123456",
			}),
		).rejects.toBeInstanceOf(UserAlreadyExistsError);
	});
});


```

## Using the Factory Pattern

- To connect to the real database, we use the factory pattern to inject the correct repository into the service layer 

```ts

import { RegisterService } from "../register";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";


export function makeRegisterService() {
	
	const usersRepository = new PrismaUsersRepository();
	const registerService = new RegisterService(usersRepository);

	return registerService;
}

```

- In the controller, the factory is used to initialize the service:

```ts
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

```