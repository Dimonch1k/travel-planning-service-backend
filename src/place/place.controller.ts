import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	ParseUUIDPipe,
	Post,
	Put,
	UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'

import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'

import { CreatePlaceDto } from './dto/create-place.dto'
import { UpdatePlaceDto } from './dto/update-place.dto'
import { PlaceService } from './place.service'

@UseGuards(JwtAuthGuard)
@Controller('trips/:tripId/places')
export class PlaceController {
	constructor(private readonly placeService: PlaceService) {}

	@UsePipes(new ValidationPipe({ whitelist: true }))
	@HttpCode(200)
	@Post()
	async createPlace(
		@CurrentUser('id') userId: string,
		@Param('tripId', ParseUUIDPipe) tripId: string,
		@Body() dto: CreatePlaceDto
	) {
		return this.placeService.createPlace(userId, tripId, dto)
	}

	@HttpCode(200)
	@Get()
	async getPlaces(
		@CurrentUser('id') userId: string,
		@Param('tripId', ParseUUIDPipe) tripId: string
	) {
		return this.placeService.getPlaces(userId, tripId)
	}

	@UsePipes(new ValidationPipe({ whitelist: true }))
	@HttpCode(200)
	@Put(':placeId')
	async updatePlace(
		@CurrentUser('id') userId: string,
		@Param('tripId', ParseUUIDPipe) tripId: string,
		@Param('placeId', ParseUUIDPipe) placeId: string,
		@Body() dto: UpdatePlaceDto
	) {
		return this.placeService.updatePlace(userId, tripId, placeId, dto)
	}

	@HttpCode(200)
	@Delete(':placeId')
	async deletePlace(
		@CurrentUser('id') userId: string,
		@Param('tripId', ParseUUIDPipe) tripId: string,
		@Param('placeId', ParseUUIDPipe) placeId: string
	) {
		return this.placeService.deletePlace(userId, tripId, placeId)
	}
}
