import { CheckIn, Prisma, User } from "@prisma/client";
import { CheckInsRepository } from "../check-ins-repository";
import { randomUUID } from "node:crypto";
import dayjs from "dayjs";

export class InmemoryCheckInsRepository implements CheckInsRepository {
	public items: CheckIn[] = [];

	async findByUserIdOnDate(userId: string, date: Date) {
		const startOfTheDay = dayjs(date).startOf("date");
		const endOfTheDay = dayjs(date).endOf("date");

		const checkInOnSameDate = this.items.find((checkIn) => {
			const checkInDate = dayjs(checkIn.createdAt);
			const isOnSameDate =
				checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);

			return checkIn.userId === userId && isOnSameDate;
		});

		if (!checkInOnSameDate) {
			return null;
		}

		return checkInOnSameDate;
	}

	async create(data: Prisma.CheckInUncheckedCreateInput) {
		const checkIn = {
			id: randomUUID(),
			userId: data.userId,
			createdAt: new Date(),
			validatedAt: data.validatedAt ? new Date(data.validatedAt) : null,
			gymId: data.gymId,
		};

		this.items.push(checkIn);

		return checkIn;
	}

	async findManyByUserId(userId: string, page: number) {
		return this.items
			.filter((item) => item.userId === userId)
			.slice((page - 1) * 20, page * 20);
	}

	async countByUserId(userId: string) {
		return this.items.filter((item) => item.userId === userId).length;
	}

	async findById(id: string) {
		const checkIn = this.items.find((item) => item.id === id);

		if (!checkIn) {
			return null;
		}

		return checkIn;
	}

	async save(checkIn: CheckIn) {
		const checkInIndex = this.items.findIndex((item) => item.id === checkIn.id);

		if (checkInIndex >= 0) {
			this.items[checkInIndex] = checkIn;
		}

		return checkIn;
	}
}
