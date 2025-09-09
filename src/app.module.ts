import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from 'src/auth/auth.module'
import { TripModule } from 'src/trip/trip.module'
import { UserModule } from 'src/user/user.module'

@Module({
	imports: [ConfigModule.forRoot(), AuthModule, UserModule, TripModule]
})
export class AppModule {}
