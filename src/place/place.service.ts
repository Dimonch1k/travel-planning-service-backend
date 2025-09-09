import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException
} from '@nestjs/common'

import { PrismaService } from 'src/prisma.service'

import { CreatePlaceDto } from './dto/create-place.dto'
import { UpdatePlaceDto } from './dto/update-place.dto'
import { returnPlaceObject } from './return-place.object'

@Injectable()
export class PlaceService {
	constructor(private readonly prisma: PrismaService) {}

	async createPlace(userId: string, tripId: string, dto: CreatePlaceDto) {
		await this.ensureUserHasTripAccess(userId, tripId)

		const place = await this.prisma.place.create({
			data: {
				locationName: dto.locationName,
				notes: dto.notes ?? null,
				dayNumber: dto.dayNumber,
				tripId
			},
			select: returnPlaceObject
		})

		if (!place) throw new BadRequestException('Place creation failed')
	}

	async getPlaces(userId: string, tripId: string) {
		await this.ensureUserHasTripAccess(userId, tripId)

		return this.prisma.place.findMany({
			where: { tripId },
			orderBy: [{ dayNumber: 'asc' }, { createdAt: 'asc' }],
			select: returnPlaceObject
		})
	}

	async updatePlace(
		userId: string,
		tripId: string,
		placeId: string,
		dto: UpdatePlaceDto
	) {
		await this.ensurePlaceExistsAndBelongsToTrip(placeId, tripId)

		await this.ensureUserHasTripAccess(userId, tripId)

		const updatedPlace = await this.prisma.place.update({
			where: { id: placeId },
			data: {
				locationName: dto.locationName,
				notes: dto.notes === undefined ? undefined : dto.notes,
				dayNumber: dto.dayNumber === undefined ? undefined : dto.dayNumber
			},
			select: returnPlaceObject
		})

		if (!updatedPlace) throw new BadRequestException('Place update failed')
	}

	async deletePlace(userId: string, tripId: string, placeId: string) {
		await this.ensureUserHasTripAccess(userId, tripId)

		const deletedPlace = await this.prisma.place.delete({
			where: { id: placeId },
			select: returnPlaceObject
		})

		if (!deletedPlace) throw new BadRequestException('Place deletion failed')
	}

	private async ensureUserHasTripAccess(userId: string, tripId: string) {
		const trip = await this.prisma.trip.findUnique({
			where: { id: tripId },
			select: { ownerId: true }
		})

		if (!trip) throw new NotFoundException('Trip not found')

		if (trip.ownerId === userId) return { isOwner: true }

		const coll = await this.prisma.tripCollaborator.findUnique({
			where: { userId_tripId: { userId, tripId } } as any
		})

		if (!coll) throw new ForbiddenException('No access to this trip')
		return { isOwner: false }
	}

	private async ensurePlaceExistsAndBelongsToTrip(
		placeId: string,
		tripId: string
	) {
		const place = await this.prisma.place.findUnique({
			where: { id: placeId },
			select: { tripId: true }
		})

		if (!place) throw new NotFoundException('Place not found')

		if (place.tripId !== tripId) {
			throw new BadRequestException(
				'Place does not belong to the specified trip'
			)
		}
	}
}
