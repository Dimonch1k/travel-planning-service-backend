import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as cors from 'cors'

import { AppModule } from './app.module'
import { Variable } from './auth/enums/env.enum'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule)
	app.setGlobalPrefix('api/v1')

	// Logs all incoming requests
	app.useGlobalInterceptors(new LoggingInterceptor())

	const configService = app.get(ConfigService)
	const PORT = configService.get<number>(Variable.PORT) || 4200

	const rawOrigins = configService.get<string>(Variable.ACCESS_ORIGINS)
	const ACCESS_ORIGINS = rawOrigins ? JSON.parse(rawOrigins) : []

	app.use(
		cors({
			origin: ACCESS_ORIGINS,
			credentials: true
		})
	)

	await app.listen(PORT)
	console.log(`App is running on port ${PORT}`)
}
bootstrap()
