import { Module } from '@nestjs/common'

import { PrismaService } from 'src/prisma.service'

import { ConfigModule } from '@nestjs/config'
import { EmailService } from '../email.service'
import { TripController } from './trip.controller'
import { TripService } from './trip.service'

@Module({
	imports: [ConfigModule],
	controllers: [TripController],
	providers: [TripService, PrismaService, EmailService],
	exports: [TripService]
})
export class TripModule {}
