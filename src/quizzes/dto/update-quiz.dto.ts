import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
    IsOptional,
    IsString,
    IsBoolean,
    MinLength,
    MaxLength,
    IsObject,
    IsUUID
} from 'class-validator'

export class UpdateCategoryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID(4)
    id?: string
}

export class UpdateQuizDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(255)
    text?: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(255)
    @IsOptional()
    description?: string

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => UpdateCategoryDto)
    @IsObject()
    category?: UpdateCategoryDto

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    isActive?: boolean
}
