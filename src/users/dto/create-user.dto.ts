import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import {
    IsEmail,
    MinLength,
    MaxLength,
    NotContains,
    IsStrongPassword
} from 'class-validator'

const stringCapitalize = (value: string) => {
    return (
        value.trim().charAt(0).toUpperCase() +
        value.trim().slice(1).toLowerCase()
    )
}

export class CreateUserDto {
    @ApiProperty()
    @MinLength(3)
    @MaxLength(250)
    @Transform(({ value }) => stringCapitalize(value))
    @NotContains(' ', { message: 'firstName can not contains spaces' })
    firstName: string

    @ApiProperty()
    @MinLength(3)
    @MaxLength(250)
    @Transform(({ value }) => stringCapitalize(value))
    @NotContains(' ', { message: 'lastName can not contains spaces' })
    lastName: string

    @ApiProperty()
    @Transform(({ value }) => value.toLowerCase().trim())
    @IsEmail()
    email: string

    @ApiProperty()
    @IsStrongPassword()
    @MinLength(6)
    @MaxLength(25)
    @NotContains(' ', { message: 'password can not contains spaces' })
    @Transform(({ value }) => value.trim())
    password: string
}
