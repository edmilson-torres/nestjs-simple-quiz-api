import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class UuidDto {
    @ApiProperty({
        type: String,
        example: '9322c384-fd8e-4a13-80cd-1cbd1ef95ba8'
    })
    @IsUUID(4)
    id: string
}
