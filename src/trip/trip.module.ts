import { Module } from '@nestjs/common'

import { PrismaService } from 'src/prisma.service'

import { ConfigModule } from '@nestjs/config'
import { EmailService } from './services/email.service'
import { TripService } from './services/trip.service'
import { TripController } from './trip.controller'

@Module({
	imports: [ConfigModule],
	controllers: [TripController],
	providers: [TripService, PrismaService, EmailService],
	exports: [TripService]
})
export class TripModule {}
