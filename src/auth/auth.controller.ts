import {
	Body,
	Controller,
	HttpCode,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'

import { AuthService } from './auth.service'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { VerifyEmailDto } from './dto/verify-email.dto'
import { JwtAuthGuard } from './guards/jwt.guard'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UsePipes(new ValidationPipe({ whitelist: true }))
	@HttpCode(200)
	@Post('register')
	async register(@Body() dto: RegisterDto) {
		return this.authService.register(dto)
	}

	@UsePipes(new ValidationPipe({ whitelist: true }))
	@HttpCode(200)
	@Post('login')
	async login(@Body() dto: LoginDto) {
		return this.authService.login(dto)
	}

	@UsePipes(new ValidationPipe({ whitelist: true }))
	@HttpCode(200)
	@Post('verify-email')
	async verifyEmail(@Body() dto: VerifyEmailDto) {
		return this.authService.verifyEmail(dto.token)
	}

	@UsePipes(new ValidationPipe({ whitelist: true }))
	@HttpCode(200)
	@Post('forgot-password')
	async forgotPassword(@Body() dto: ForgotPasswordDto) {
		return this.authService.forgotPassword(dto.email)
	}

	@UsePipes(new ValidationPipe({ whitelist: true }))
	@HttpCode(200)
	@Post('reset-password')
	async resetPassword(@Body() dto: ResetPasswordDto) {
		return this.authService.resetPassword(dto.token, dto.password)
	}

	@UseGuards(JwtAuthGuard)
	@HttpCode(200)
	@Post('logout')
	async logout() {
		return {
			message: 'Successfully logged out'
		}
	}
}
