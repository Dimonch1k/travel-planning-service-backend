import { BadRequestException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { verify } from 'argon2'
import { randomBytes } from 'crypto'

import { EmailService } from 'src/email.service'
import { UserService } from 'src/user/user.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

interface IJwtPayload {
	id: string
}

const TOKEN_EXPIRES_IN = '7d'
const FORGOT_PASSWORD_MESSAGE =
	'If an account with that email exists, you will receive a password reset link'

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwt: JwtService,
		private readonly emailService: EmailService
	) {}

	async register(dto: RegisterDto) {
		const existingUser = await this.userService.getByEmail(dto.email)

		if (existingUser) {
			throw new BadRequestException('User already exists')
		}

		const user = await this.userService.create(dto)

		const verificationToken = this.generateSecureToken()
		await this.userService.setEmailVerificationToken(user.id, verificationToken)

		await this.emailService.sendEmailVerification(user.email, verificationToken)

		const accessToken = this.issueToken(user.id)

		return {
			user,
			accessToken,
			message:
				'Registration successful. Please check your email to verify your account.'
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

	async verifyEmail(token: string) {
		const user = await this.userService.findByVerificationToken(token)

		if (!user) {
			throw new BadRequestException('Invalid or expired verification token')
		}

		await this.userService.verifyEmail(user.id)

		return {
			message: 'Email verified successfully'
		}
	}

	async forgotPassword(email: string) {
		const user = await this.userService.getByEmail(email)

		if (!user) {
			return {
				message: FORGOT_PASSWORD_MESSAGE
			}
		}

		const resetToken = this.generateSecureToken()
		const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hour

		await this.userService.setPasswordResetToken(user.id, resetToken, expiresAt)
		await this.emailService.sendPasswordReset(email, resetToken)

		return {
			message: FORGOT_PASSWORD_MESSAGE
		}
	}

	async resetPassword(token: string, newPassword: string) {
		const user = await this.userService.findByPasswordResetToken(token)

		if (!user) {
			throw new BadRequestException('Invalid or expired reset token')
		}

		await this.userService.resetPassword(user.id, newPassword)

		return {
			message: 'Password reset successfully'
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

		if (!user) {
			throw new BadRequestException('Invalid email or password')
		}

		const isValid = await verify(user.password, dto.password)
		if (!isValid) {
			throw new BadRequestException('Invalid email or password')
		}

		const { password, ...userWithoutPassword } = user
		return userWithoutPassword
	}

	private generateSecureToken(): string {
		return randomBytes(32).toString('hex')
	}
}
