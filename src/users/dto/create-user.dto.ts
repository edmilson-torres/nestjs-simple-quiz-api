import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEmail, MinLength, MaxLength } from 'class-validator'

export class CreateUserDto {
    @ApiProperty()
    @MinLength(3)
    @MaxLength(250)
    firstName: string

    @ApiProperty()
    @MinLength(3)
    @MaxLength(250)
    lastName: string

    @ApiProperty()
    @Transform((param) => param.value.toLowerCase().trim())
    @IsEmail()
    email: string

    @ApiProperty()
    @MinLength(6)
    @MaxLength(25)
    password: string
}
