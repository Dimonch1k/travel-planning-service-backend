import { ConfigService } from '@nestjs/config'
import { JwtModuleOptions } from '@nestjs/jwt'

import { Variable } from 'src/auth/enums/env.enum'

export const getJwtConfig = async (
	configService: ConfigService
): Promise<JwtModuleOptions> => {
	const secret = configService.get<string>(Variable.ACCESS_TOKEN_SECRET)
	const expiresIn = configService.get<string>(
		Variable.ACCESS_TOKEN_EXPIRATION_DAYS
	)

	if (!secret || !expiresIn) {
		throw new Error('JWT config values are missing from .env')
	}

	return {
		secret,
		signOptions: {
			expiresIn
		}
	}
}
