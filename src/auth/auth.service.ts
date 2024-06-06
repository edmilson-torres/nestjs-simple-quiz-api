import {
    BadRequestException,
    Injectable,
    UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { Role, UserEntity } from '../users/entities/user.entity'
import { UsersService } from '../users/users.service'
import { HashService } from '../shared/hash/hash.service'
import { jwtConstants } from './auth.config'

export interface JwtTokenPayload {
    sub: string
    email: string
    roles: Role[]
    iat?: number
    exp?: number
}

export interface JwtRefreshTokenPayload {
    sub: string
    iat?: number
    exp?: number
}

export interface UserTokens {
    access_token: string
    refresh_token: string
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
                user.password
            )

            if (isPasswordValid) {
                return new UserEntity({
                    ...user,
                    password: undefined
                })
            }
        }

        throw new UnauthorizedException(
            'Email address or password provided is incorrect.'
        )
    }

    private async generateTokens(data: JwtTokenPayload) {
        const token = this.jwtService.sign(data, {
            secret: jwtConstants.secret,
            expiresIn: jwtConstants.expires
        })

        const refreshToken = this.jwtService.sign(
            { sub: data.sub },
            {
                secret: jwtConstants.refreshSecret,
                expiresIn: jwtConstants.refreshExpires
            }
        )

        return { access_token: token, refresh_token: refreshToken }
    }

    async login(user: Partial<UserEntity>): Promise<UserTokens> {
        const payload: JwtTokenPayload = {
            sub: user.id,
            email: user.email,
            roles: user.roles
        }

        const { access_token, refresh_token } =
            await this.generateTokens(payload)

        const newSignature = refresh_token.split('.')[2]

        await this.usersService.updateRefreshToken(user.id, newSignature)

        return { access_token, refresh_token }
    }

    async refreshTokens(refreshTokenInput: string): Promise<UserTokens> {
        const { sub } = this.jwtService.decode(refreshTokenInput)

        const user = await this.usersService.findOneById(sub)

        if (!user) {
            throw new BadRequestException('invalid user')
        }

        const signature = refreshTokenInput.split('.')[2]

        if (user.refreshToken) {
            const isRefreshTokenValid = await this.hashing.compare(
                signature,
                user.refreshToken
            )

            if (!isRefreshTokenValid) {
                throw new BadRequestException('invalid refresh token')
            }
        }

        const payload: JwtTokenPayload = {
            sub: user.id,
            email: user.email,
            roles: user.roles
        }

        const { access_token, refresh_token } =
            await this.generateTokens(payload)

        const newSignature = refresh_token.split('.')[2]

        await this.usersService.updateRefreshToken(user.id, newSignature)

        return { access_token, refresh_token }
    }
}
