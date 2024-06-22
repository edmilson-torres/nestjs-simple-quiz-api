import { RolesEnum } from '../entities/roles.enum'

export type PassportUser = {
    id: string
    email: string
    roles: RolesEnum[]
}
