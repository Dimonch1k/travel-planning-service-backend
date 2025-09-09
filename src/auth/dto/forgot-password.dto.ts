import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class ForgotPasswordDto {
	@IsString({ message: 'Email must be a string' })
	@IsNotEmpty({ message: 'Email is required' })
	@IsEmail({}, { message: 'Email must be a valid email address' })
	email: string
}
