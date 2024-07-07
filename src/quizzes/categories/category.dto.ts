import { ApiProperty } from '@nestjs/swagger'
import { IsString, MinLength, MaxLength } from 'class-validator'

export class CategoryDto {
    @ApiProperty()
    @IsString()
    @MinLength(2)
    @MaxLength(255)
    name: string
}
