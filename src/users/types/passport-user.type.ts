import { RolesEnum } from '../entities/user.entity'

export type PassportUser = {
    id: string
    email: string
    roles: RolesEnum[]
}
