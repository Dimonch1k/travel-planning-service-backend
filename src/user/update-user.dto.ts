import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator'

export class UpdateUserDto {
	@IsOptional()
	@IsString({ message: 'Name must be a string' })
	name?: string

	@IsOptional()
	@IsEmail({}, { message: 'Email must be a valid email address' })
	email?: string

	@IsOptional()
	@IsString({ message: 'Password must be a string' })
	@MinLength(6, { message: 'Password must be at least 6 characters long' })
	password?: string

	@IsString({ message: 'Current password must be a string' })
	currentPassword: string
}
