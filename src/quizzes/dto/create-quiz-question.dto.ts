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

import { CreateQuizAnswerDto } from './create-quiz-answer.dto'
import { AnswersValidation } from '../answers/answers.validation'

export class CreateQuizQuestionDto {
    @ApiProperty()
    @IsString()
    @MinLength(10)
    @MaxLength(255)
    text: string

    @ApiProperty({ type: [CreateQuizAnswerDto], maxItems: 5, minItems: 2 })
    @IsArray()
    @ArrayMaxSize(5)
    @ArrayMinSize(2)
    @ValidateNested({ each: true })
    @Type(() => CreateQuizAnswerDto)
    @Validate(AnswersValidation)
    @IsOptional()
    answers?: CreateQuizAnswerDto[]
}
