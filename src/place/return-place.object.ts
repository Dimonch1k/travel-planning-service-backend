import { Prisma } from 'prisma/generated/prisma'

export const returnPlaceObject: Prisma.PlaceSelect = {
	id: true,
	createdAt: true,
	updatedAt: true,

	locationName: true,
	notes: true,
	dayNumber: true,

	tripId: true
}
