import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator'

export class CreatePlaceDto {
	@IsString({ message: 'locationName must be a string' })
	@IsNotEmpty({ message: 'locationName is required' })
	locationName: string

	@IsOptional()
	@IsString({ message: 'notes must be a string' })
	notes?: string

	@IsInt({ message: 'dayNumber must be an integer' })
	@Min(1, { message: 'dayNumber must be >= 1' })
	dayNumber: number
}
