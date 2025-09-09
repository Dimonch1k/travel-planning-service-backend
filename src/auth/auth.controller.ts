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
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { JwtAuthGuard } from './guards/jwt.guard'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
	@HttpCode(200)
	@Post('register')
	async register(@Body() dto: RegisterDto) {
		return this.authService.register(dto)
	}

	@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
	@HttpCode(200)
	@Post('login')
	async login(@Body() dto: LoginDto) {
		return this.authService.login(dto)
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
