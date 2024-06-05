import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { jwtConstants } from '../auth.config'
import { JwtRefreshTokenPayload } from '../auth.service'
import { UserEntity } from 'src/users/entities/user.entity'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh'
) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.refreshSecret
        })
    }

    async validate(
        payload: JwtRefreshTokenPayload
    ): Promise<Partial<UserEntity>> {
        return { id: payload.sub }
    }
}
