import { RoleEnum } from '../entities/role.enum'

export const isAdmin = (role: RoleEnum) => {
    return role === RoleEnum.Admin
}
