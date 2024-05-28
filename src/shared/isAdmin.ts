import { Role } from 'src/auth/role.enum'

export const isAdmin = (roles: Role[]) => {
    if (Array.isArray(roles) && roles.length === 0) return false

    return roles.some((role) => role === Role.Admin)
}
