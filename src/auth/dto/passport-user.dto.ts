import { IsEmail, IsEnum, IsUUID } from 'class-validator'
import { RolesEnum } from '../../users/entities/user.entity'

export class PassportUserDto {
    @IsUUID()
    id: string

    @IsEmail()
    email: string

    @IsEnum(RolesEnum)
    roles: RolesEnum[]
}
