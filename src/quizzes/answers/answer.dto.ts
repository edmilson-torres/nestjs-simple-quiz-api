import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import {
    IsString,
    MinLength,
    MaxLength,
    IsOptional,
    IsBoolean,
    IsUUID
} from 'class-validator'

export class CreateAnswerDto {
    @ApiProperty()
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    text: string

    @ApiPropertyOptional({ default: false })
    @IsOptional()
    @IsBoolean()
    isCorrect?: boolean

    @ApiProperty({ description: 'Question UUID v4' })
    @IsUUID(4)
    question: string
}

export class UpdateQuestionDto extends PartialType(CreateAnswerDto) {}
