import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import {
    IsEmail,
    MinLength,
    MaxLength,
    NotContains,
    IsStrongPassword,
    IsEnum
} from 'class-validator'
import { Role } from '../entities/user.entity'

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

    @ApiPropertyOptional()
    @IsEnum(Role, { each: true })
    roles?: Role[] = [Role.User]
}
