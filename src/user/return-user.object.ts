import { Prisma } from 'prisma/generated/prisma'

export const returnUserObject: Prisma.UserSelect = {
	id: true,
	name: true,
	email: true,
	createdAt: true,
	updatedAt: true
}
