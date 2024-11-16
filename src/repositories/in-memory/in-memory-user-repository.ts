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
