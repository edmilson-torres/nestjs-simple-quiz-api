import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsString, MinLength, MaxLength, IsUUID } from 'class-validator'

export class CreateQuestionDto {
    @ApiProperty()
    @IsString()
    @MinLength(10)
    @MaxLength(255)
    text: string

    @ApiProperty({ description: 'Quiz UUID v4' })
    @IsUUID(4)
    quiz: string
}

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {}
