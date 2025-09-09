import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateTripDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  title: string

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
