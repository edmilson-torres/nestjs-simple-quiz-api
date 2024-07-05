import { RoleEnum } from '../entities/role.enum'

export const isAdmin = (role: RoleEnum) => {
    if (!Array.isArray(role) || role.length === 0) return false

    return role.some((role) => role === RoleEnum.Admin)
}
