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
    MaxLength,
    IsObject
} from 'class-validator'

export class AnswerDto {
    @ApiProperty()
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    answer: string

    @ApiPropertyOptional({ default: false })
    @IsOptional()
    @IsBoolean()
    isCorrect?: boolean
}

export class QuestionDto {
    @ApiProperty()
    @IsString()
    @MinLength(10)
    @MaxLength(255)
    question: string

    @ApiProperty({ type: [AnswerDto], maxItems: 5, minItems: 2 })
    @IsArray()
    @ArrayMaxSize(5)
    @ArrayMinSize(2)
    @ValidateNested({ each: true })
    @Type(() => AnswerDto)
    answers: AnswerDto[]
}

export class CategoryDto {
    @ApiProperty()
    @IsString()
    @MinLength(2)
    @MaxLength(255)
    name: string
}

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
    @Type(() => CategoryDto)
    @IsObject()
    category: CategoryDto

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    isActive: boolean

    @ApiProperty({ type: [QuestionDto], maxItems: 20, minItems: 1 })
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(20)
    @ValidateNested({ each: true })
    @Type(() => QuestionDto)
    questions: QuestionDto[]
}
