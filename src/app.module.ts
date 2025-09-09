import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from 'src/auth/auth.module'
import { UserModule } from 'src/user/user.module'
import { TripModule } from './trip/trip.module'

@Module({
	imports: [ConfigModule.forRoot(), AuthModule, UserModule, TripModule]
})
export class AppModule {}
