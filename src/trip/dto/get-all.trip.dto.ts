import { IsEnum, IsOptional, IsString } from 'class-validator'

export enum EnumTripSort {
	NEWEST = 'newest',
	OLDEST = 'oldest',
	A_Z = 'a-z'
}

export class GetAllTripDto {
	@IsOptional()
	@IsEnum(EnumTripSort, {
		message: `Sort must be one of ${Object.values(EnumTripSort).join(', ')}`
	})
	sort?: EnumTripSort

	@IsOptional()
	@IsString()
	searchTerm?: string
}
