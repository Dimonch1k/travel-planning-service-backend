import { IsEmail, IsString } from 'class-validator'

export class CreateTripInviteDto {
	@IsString({ message: 'Email must be a string' })
	@IsEmail({}, { message: 'Email must be valid email address' })
	email: string
}
