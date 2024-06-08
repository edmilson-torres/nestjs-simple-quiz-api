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

export class AnswerDto {
    @ApiProperty()
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    answer: string

    @ApiPropertyOptional({ default: false })
    @IsBoolean()
    isCorrect?: boolean
}

export class QuestionDto {
    @ApiProperty()
    @IsString()
    @MinLength(2)
    @MaxLength(255)
    question: string

    @ApiProperty({ type: [AnswerDto], maxItems: 5, minItems: 2 })
    @IsArray()
    @ArrayMaxSize(5)
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => AnswerDto)
    answers: AnswerDto[]
}

export class CreateQuizDto {
    @ApiProperty()
    @IsString()
    @MinLength(2)
    @MaxLength(255)
    text: string

    @ApiPropertyOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(255)
    @IsOptional()
    description?: string

    @ApiProperty()
    @IsString()
    @MinLength(2)
    @MaxLength(255)
    category: string

    @ApiProperty({ type: [QuestionDto], maxItems: 20, minItems: 1 })
    @IsArray()
    @ArrayMinSize(1)
    @ArrayMaxSize(20)
    @ValidateNested({ each: true })
    @Type(() => QuestionDto)
    questions: QuestionDto[]
}
