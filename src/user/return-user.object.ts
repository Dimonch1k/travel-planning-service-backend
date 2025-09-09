import { Prisma } from 'prisma/generated/prisma'

export const returnUserObject: Prisma.UserSelect = {
	id: true,
	createdAt: true,
	updatedAt: true,

	name: true,
	email: true
}
