import { Prisma } from 'prisma/generated/prisma'

export const returnTripObject: Prisma.TripSelect = {
	id: true,
	createdAt: true,
	updatedAt: true,

	title: true,
	description: true,
	startDate: true,
	endDate: true,

	ownerId: true
}
