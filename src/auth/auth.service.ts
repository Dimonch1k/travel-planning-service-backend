import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { verify } from 'argon2'

import { UserService } from 'src/user/user.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

interface IJwtPayload {
	id: string
}

const TOKEN_EXPIRES_IN = '7d'

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwt: JwtService
	) {}

	async register(dto: RegisterDto) {
		const existingUser = await this.userService.getByEmail(dto.email)

		if (existingUser) throw new BadRequestException('User already exists')

		const user = await this.userService.create(dto)
		const accessToken = this.issueToken(user.id)

		return {
			user,
			accessToken
		}
	}

	async login(dto: LoginDto) {
		const user = await this.validateUser(dto)
		const accessToken = this.issueToken(user.id)

		return {
			user,
			accessToken
		}
	}

	private issueToken(userId: string) {
		const payload: IJwtPayload = {
			id: userId
		}

		return this.jwt.sign(payload, {
			expiresIn: TOKEN_EXPIRES_IN
		})
	}

	private async validateUser(dto: LoginDto) {
		const user = await this.userService.getByEmail(dto.email)

		if (!user) throw new BadRequestException('Invalid email or password')

		const isValid = await verify(user.password, dto.password)
		if (!isValid) throw new BadRequestException('Invalid email or password')

		const { password, ...userWithoutPassword } = user
		return userWithoutPassword
	}
}
