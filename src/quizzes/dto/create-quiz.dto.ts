import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
    IsOptional,
    IsString,
    IsArray,
    IsBoolean,
    ValidateNested,
    ArrayMaxSize,
    ArrayMinSize,
    MinLength,
    MaxLength
} from 'class-validator'

import { CategoryDto } from '../categories/category.dto'
import { CreateQuestionDto } from '../questions/question.dto'

export class CreateQuizDto {
    @ApiProperty()
    @IsString()
    @MinLength(2)
    @MaxLength(255)
    text: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(255)
    description?: string

    @ApiProperty()
    @ValidateNested({ each: true })
    @Type(() => CategoryDto)
    category: CategoryDto

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    isActive: boolean

    @ApiProperty({ type: [CreateQuestionDto], maxItems: 20, minItems: 1 })
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(20)
    @ValidateNested({ each: true })
    @Type(() => CreateQuestionDto)
    questions: CreateQuestionDto[]
}
