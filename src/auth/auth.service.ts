import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { UserEntity } from '../users/entities/user.entity'
import { UsersService } from '../users/users.service'
import { HashService } from '../shared/hash/hash.service'

export interface UserPayload {
    sub: string
    email: string
    roles: string[]
}

export interface UserToken {
    access_token: string
}

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private hashing: HashService
    ) {}

    async validateUser(email: string, password: string): Promise<UserEntity> {
        const user = await this.usersService.findOneByEmail(email)

        if (user) {
            const isPasswordValid = await this.hashing.compare(
                password,
                user.passwordHash
            )

            if (isPasswordValid) {
                return {
                    ...user,
                    passwordHash: undefined
                }
            }
        }

        throw new UnauthorizedException(
            'Email address or password provided is incorrect.'
        )
    }

    async login(user: Partial<UserEntity>): Promise<UserToken> {
        const payload: UserPayload = {
            sub: user.id,
            email: user.email,
            roles: user.roles
        }

        return {
            access_token: this.jwtService.sign(payload)
        }
    }
}
