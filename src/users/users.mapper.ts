import { UserEntity } from './entities/user.entity'

export class UserMapper {
    static cleanObjectFromUndefined(data: object) {
        return Object.entries(data)
            .filter(([, value]) => value !== undefined)
            .reduce((obj, [key, value]) => {
                obj[key] = value
                return obj
            }, {})
    }

    static toResponse(user: Partial<UserEntity>) {
        const newUser = new UserEntity({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            roles: user.roles
        })

        return this.cleanObjectFromUndefined(newUser)
    }

    static toPersistence(user: Partial<UserEntity>) {
        const newUser = new UserEntity({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            roles: user.roles,
            passwordHash: user.passwordHash
        })

        return UserMapper.cleanObjectFromUndefined(newUser)
    }
}
