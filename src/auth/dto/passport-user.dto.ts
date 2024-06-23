import { IsEmail, IsEnum, IsUUID } from 'class-validator'
import { RolesEnum } from '../../users/entities/roles.enum'

export class PassportUserDto {
    @IsUUID(4)
    id: string

    @IsEmail()
    email: string

    @IsEnum(RolesEnum)
    roles: RolesEnum[]
}
