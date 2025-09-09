import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'

import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'

import { CreateTripDto } from './dto/create-trip.dto'
import { GetAllTripDto } from './dto/get-all.trip.dto'
import { UpdateTripDto } from './dto/update-trip.dto'
import { TripService } from './trip.service'

@UseGuards(JwtAuthGuard)
@Controller('trips')
export class TripController {
	constructor(private readonly tripService: TripService) {}

	@UsePipes(new ValidationPipe({ whitelist: true }))
	@HttpCode(201)
	@Post()
	async createTrip(
		@CurrentUser('id') userId: string,
		@Body() dto: CreateTripDto
	) {
		return this.tripService.create(userId, dto)
	}

	@HttpCode(200)
	@Get()
	async getMyTrips(
		@CurrentUser('id') userId: string,
		@Query() dto: GetAllTripDto = {}
	) {
		return this.tripService.getUserTrips(userId, dto)
	}

	@HttpCode(200)
	@Get(':id')
	async getTrip(
		@CurrentUser('id') userId: string,
		@Param('id') tripId: string
	) {
		return this.tripService.getById(userId, tripId)
	}

	@UsePipes(new ValidationPipe({ whitelist: true }))
	@HttpCode(200)
	@Put(':id')
	async updateTrip(
		@CurrentUser('id') userId: string,
		@Param('id') tripId: string,
		@Body() dto: UpdateTripDto
	) {
		return this.tripService.update(userId, tripId, dto)
	}

	@HttpCode(200)
	@Delete(':id')
	async deleteTrip(
		@CurrentUser('id') userId: string,
		@Param('id') tripId: string
	) {
		return this.tripService.delete(userId, tripId)
	}
}
