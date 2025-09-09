import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { randomBytes } from 'crypto'
import { addHours } from 'date-fns'

import { InvitationStatus } from 'prisma/generated/prisma'
import { PrismaService } from 'src/prisma.service'

import { CreateTripInviteDto } from './dto/create-invite.dto'
import { CreateTripDto } from './dto/create-trip.dto'
import { EnumTripSort, GetAllTripDto } from './dto/get-all.trip.dto'
import { UpdateTripDto } from './dto/update-trip.dto'
import { returnTripObject } from './return-trip.object'

import { EmailService } from '../email.service'

@Injectable()
export class TripService {
	constructor(
		private readonly prisma: PrismaService,
		private emailService: EmailService
	) {}

	async create(userId: string, dto: CreateTripDto) {
		this.checkDateValidity(dto.startDate, dto.endDate)

		const createdTrip = await this.prisma.trip.create({
			data: {
				title: dto.title,
				description: dto.description,
				startDate: dto.startDate ? new Date(dto.startDate) : null,
				endDate: dto.endDate ? new Date(dto.endDate) : null,
				ownerId: userId
			},
			select: returnTripObject
		})

		if (!createdTrip) {
			throw new BadRequestException('Trip creation failed')
		}
	}

	async getUserTrips(userId: string, dto: GetAllTripDto = {}) {
		const { searchTerm, sort } = dto

		let orderBy: any = { createdAt: 'desc' }

		if (sort === EnumTripSort.OLDEST) orderBy = { createdAt: 'asc' }
		if (sort === EnumTripSort.A_Z) orderBy = { title: 'asc' }

		return this.prisma.trip.findMany({
			where: {
				OR: [{ ownerId: userId }, { collaborators: { some: { userId } } }],
				AND: searchTerm
					? [
							{
								OR: [
									{ title: { contains: searchTerm, mode: 'insensitive' } },
									{ description: { contains: searchTerm, mode: 'insensitive' } }
								]
							}
						]
					: undefined
			},
			orderBy,
			select: returnTripObject
		})
	}

	async getById(userId: string, tripId: string) {
		const trip = await this.prisma.trip.findUnique({
			where: { id: tripId },
			select: returnTripObject
		})

		if (!trip) throw new NotFoundException('Trip not found')

		// check access
		const isOwner = trip.ownerId === userId
		const isCollaborator = await this.prisma.tripCollaborator.findFirst({
			where: { tripId, userId }
		})

		if (!isOwner && !isCollaborator) {
			throw new ForbiddenException('No access to this trip')
		}

		return trip
	}

	async update(userId: string, tripId: string, dto: UpdateTripDto) {
		const trip = await this.prisma.trip.findUnique({ where: { id: tripId } })

		if (!trip) throw new NotFoundException('Trip not found')
		if (trip.ownerId !== userId) throw new ForbiddenException('Not your trip')

		this.checkDateValidity(dto.startDate, dto.endDate)

		const updatedTrip = await this.prisma.trip.update({
			where: { id: tripId },
			data: {
				title: dto.title,
				description: dto.description,
				startDate: dto.startDate ? new Date(dto.startDate) : undefined,
				endDate: dto.endDate ? new Date(dto.endDate) : undefined
			},
			select: returnTripObject
		})

		if (!updatedTrip) {
			throw new BadRequestException('Trip update failed')
		}
	}

	async delete(userId: string, tripId: string) {
		const trip = await this.prisma.trip.findUnique({ where: { id: tripId } })

		if (!trip) throw new NotFoundException('Trip not found')
		if (trip.ownerId !== userId) throw new ForbiddenException('Not your trip')

		const deletedTrip = await this.prisma.trip.delete({
			where: { id: tripId },
			select: returnTripObject
		})

		if (!deletedTrip) {
			throw new BadRequestException('Trip deletion failed')
		}
	}

	async inviteCollaborator(
		ownerId: string,
		tripId: string,
		dto: CreateTripInviteDto
	) {
		const trip = await this.prisma.trip.findUnique({
			where: { id: tripId },
			include: { owner: true, collaborators: true }
		})

		if (!trip) throw new NotFoundException('Trip not found')
		if (trip.ownerId !== ownerId) {
			throw new ForbiddenException('Only owner can invite')
		}

		const inviteEmail = dto.email.toLowerCase()
		const ownerEmail = trip.owner.email.toLowerCase()

		if (inviteEmail === ownerEmail) {
			throw new BadRequestException('Cannot invite yourself')
		}

		const invitedUser = await this.prisma.user.findUnique({
			where: { email: inviteEmail }
		})

		if (invitedUser) {
			const isAlreadyCollaborator = trip.collaborators.some(
				c => c.userId === invitedUser.id
			)
			if (isAlreadyCollaborator) {
				throw new BadRequestException('User is already a collaborator')
			}
		}

		const existingInvite = await this.prisma.tripInvitation.findFirst({
			where: { tripId, email: inviteEmail, status: InvitationStatus.PENDING }
		})
		if (existingInvite) {
			throw new BadRequestException('Invite already sent')
		}

		const token = randomBytes(32).toString('hex')
		const expiresAt = addHours(new Date(), 24)

		const invite = await this.prisma.tripInvitation.create({
			data: {
				email: inviteEmail,
				token,
				expiresAt,
				tripId,
				invitedById: ownerId
			}
		})

		if (!invite) throw new BadRequestException('Invite creation failed')

		await this.emailService.sendTripInvitation(inviteEmail, trip.title, token)
	}

	async acceptInvite(userId: string, token: string) {
		const invite = await this.prisma.tripInvitation.findUnique({
			where: { token },
			include: { trip: true }
		})

		if (!invite) throw new BadRequestException('Invalid token')
		if (invite.status !== InvitationStatus.PENDING) {
			throw new BadRequestException('Invite already used')
		}
		if (invite.expiresAt && invite.expiresAt < new Date()) {
			throw new BadRequestException('Invite expired')
		}

		if (invite.trip.ownerId === userId) {
			throw new BadRequestException('Owner cannot accept own invite')
		}

		await this.prisma.tripCollaborator.upsert({
			where: { userId_tripId: { userId, tripId: invite.tripId } },
			update: {},
			create: { userId, tripId: invite.tripId }
		})

		await this.prisma.tripInvitation.update({
			where: { id: invite.id },
			data: { status: InvitationStatus.ACCEPTED }
		})

		return { success: true }
	}

	private checkDateValidity(startDate?: string, endDate?: string) {
		if (startDate && endDate) {
			if (new Date(startDate) > new Date(endDate)) {
				throw new BadRequestException('startDate cannot be after endDate')
			}
		}
	}
}
