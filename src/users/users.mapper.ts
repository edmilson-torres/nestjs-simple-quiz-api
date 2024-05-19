import { User } from './entities/user.entity'

export class UserMapper {
    static cleanObjectFromUndefined(data: object) {
        return Object.entries(data)
            .filter(([, value]) => value !== undefined)
            .reduce((obj, [key, value]) => {
                obj[key] = value
                return obj
            }, {})
    }

    static toResponse(user: Partial<User>) {
        const newUser = new User()

        newUser.id = user.id
        newUser.email = user.email
        newUser.firstName = user.firstName
        newUser.lastName = user.lastName
        newUser.role = user.role

        return this.cleanObjectFromUndefined(newUser)
    }

    static toPersistence(user: Partial<User>) {
        const newUser = new User()

        newUser.id = user.id
        newUser.email = user.email
        newUser.firstName = user.firstName
        newUser.lastName = user.lastName
        newUser.role = user.role
        newUser.passwordHash = user.passwordHash

        return UserMapper.cleanObjectFromUndefined(newUser)
    }
}
