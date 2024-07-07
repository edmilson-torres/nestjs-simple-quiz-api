import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
    IsString,
    MinLength,
    MaxLength,
    IsOptional,
    IsBoolean
} from 'class-validator'

export class AnswerDto {
    @ApiProperty()
    @IsString()
    @MinLength(1)
    @MaxLength(255)
    text: string

    @ApiPropertyOptional({ default: false })
    @IsOptional()
    @IsBoolean()
    isCorrect?: boolean
}
