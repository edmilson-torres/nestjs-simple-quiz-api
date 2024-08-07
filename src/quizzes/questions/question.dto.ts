import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
    IsString,
    MinLength,
    MaxLength,
    IsArray,
    ArrayMaxSize,
    ArrayMinSize,
    ValidateNested,
    IsOptional,
    Validate
} from 'class-validator'

import { AnswerDto } from '../answers/answer.dto'
import { AnswersValidation } from '../answers/answers.validation'
import { UuidDto } from '../dto/uuid.dto'

export class CreateQuestionDto {
    @ApiProperty()
    @IsString()
    @MinLength(10)
    @MaxLength(255)
    text: string

    @ApiProperty({ type: [AnswerDto], maxItems: 5, minItems: 2 })
    @IsArray()
    @ArrayMaxSize(5)
    @ArrayMinSize(2)
    @ValidateNested({ each: true })
    @Type(() => AnswerDto)
    @Validate(AnswersValidation)
    @IsOptional()
    answers?: AnswerDto[]

    @ApiProperty({ type: UuidDto })
    @Type(() => UuidDto)
    @ValidateNested()
    quiz: UuidDto
}

export class UpdateQuestionDto {
    @ApiProperty()
    @IsString()
    @MinLength(10)
    @MaxLength(255)
    text: string

    @ApiProperty({ type: UuidDto })
    @Type(() => UuidDto)
    @ValidateNested()
    quiz: UuidDto
}
