import {
	Body,
	Controller,
	Get,
	HttpCode,
	Put,
	UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'

import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard'

import { UpdateUserDto } from './update-user.dto'
import { UserService } from './user.service'

@UseGuards(JwtAuthGuard)
@Controller('user/profile')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@HttpCode(200)
	@Get()
	async profile(@CurrentUser('id') id: string) {
		return this.userService.getProfile(id)
	}

	@UsePipes(new ValidationPipe({ whitelist: true }))
	@HttpCode(200)
	@Put()
	async updateProfile(
		@CurrentUser('id') id: string,
		@Body() dto: UpdateUserDto
	) {
		return this.userService.update(id, dto)
	}
}
