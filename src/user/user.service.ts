import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { hash, verify } from 'argon2'
import { RegisterDto } from 'src/auth/dto/register.dto'
import { PrismaService } from 'src/prisma.service'
import { returnUserObject } from './return-user.object'
import { UpdateUserDto } from './update-user.dto'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async getById(id: string) {
		return this.prisma.user.findUnique({
			where: { id },
			select: returnUserObject
		})
	}

	async getByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: { email }
		})
	}

	async getProfile(id: string) {
		const profile = await this.getById(id)

		if (!profile) throw new NotFoundException('User not found')

		return profile
	}

	async create(dto: RegisterDto) {
		const user = {
			...dto,
			password: await hash(dto.password)
		}

		const createdUser = this.prisma.user.create({
			data: user,
			select: returnUserObject
		})

		if (!createdUser) {
			throw new BadRequestException('User creation failed. Please try again.')
		}

		return createdUser
	}

	async update(id: string, dto: UpdateUserDto) {
		const user = await this.prisma.user.findUnique({ where: { id } })

		if (!user) throw new NotFoundException('User not found')

		const isValidPassword = await verify(user.password, dto.currentPassword)
		if (!isValidPassword) {
			throw new BadRequestException('Invalid current password')
		}

		const dataToUpdate: any = {
			name: dto.name,
			email: dto.email
		}

		if (dto.password) {
			dataToUpdate.password = await hash(dto.password)
		}

		return this.prisma.user.update({
			where: { id },
			data: dataToUpdate,
			select: returnUserObject
		})
	}
}
