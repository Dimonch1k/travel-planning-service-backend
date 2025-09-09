import { IsDateString, IsOptional, IsString } from 'class-validator'

export class UpdateTripDto {
	@IsOptional()
	@IsString({ message: 'Title must be a string' })
	title?: string

	@IsOptional()
	@IsString({ message: 'Description must be a string' })
	description?: string

	@IsOptional()
	@IsDateString({}, { message: 'startDate must be a valid date' })
	startDate?: string

	@IsOptional()
	@IsDateString({}, { message: 'endDate must be a valid date' })
	endDate?: string
}
