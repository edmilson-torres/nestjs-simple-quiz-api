import { RolesEnum } from '../entities/user.entity'

export const isAdmin = (roles: RolesEnum[]) => {
    if (!Array.isArray(roles) || roles.length === 0) return false

    return roles.some((role) => role === RolesEnum.Admin)
}
