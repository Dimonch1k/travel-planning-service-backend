import { Module } from '@nestjs/common'

import { PrismaService } from 'src/prisma.service'

import { TripController } from './trip.controller'
import { TripService } from './trip.service'

@Module({
	controllers: [TripController],
	providers: [TripService, PrismaService],
	exports: [TripService]
})
export class TripModule {}
