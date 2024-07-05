import { IsEmail, IsEnum, IsUUID } from 'class-validator'
import { RoleEnum } from '../../users/entities/role.enum'

export class PassportUserDto {
    @IsUUID(4)
    id: string

    @IsEmail()
    email: string

    @IsEnum(RoleEnum)
    role: RoleEnum
}
