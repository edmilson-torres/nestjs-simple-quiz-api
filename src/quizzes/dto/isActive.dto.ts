import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean } from 'class-validator'

export class IsActiveDto {
    @ApiProperty()
    @IsBoolean()
    isActive: boolean
}
