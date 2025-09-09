import { IsInt, IsOptional, IsString, Min } from 'class-validator'

export class UpdatePlaceDto {
	@IsOptional()
	@IsString({ message: 'locationName must be a string' })
	locationName?: string

	@IsOptional()
	@IsString({ message: 'notes must be a string' })
	notes?: string

	@IsOptional()
	@IsInt({ message: 'dayNumber must be an integer' })
	@Min(1, { message: 'dayNumber must be >= 1' })
	dayNumber?: number
}
