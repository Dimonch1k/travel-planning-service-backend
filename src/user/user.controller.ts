import {
	Body,
	Controller,
	Get,
	HttpCode,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'

import { CurrentUser } from 'src/auth/decorators/user.decorator'

import { Auth } from 'src/auth/decorators/auth.decorator'
import { UpdateUserDto } from './update-user.dto'
import { UserService } from './user.service'

@Auth()
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
