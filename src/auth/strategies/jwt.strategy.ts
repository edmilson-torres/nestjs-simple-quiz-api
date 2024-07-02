import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { jwtConstants } from '../auth.config'
import { JwtTokenPayload } from '../auth.service'
import { UserEntity } from '../../users/entities/user.entity'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret
        })
    }

    async validate(
        payload: JwtTokenPayload
    ): Promise<Pick<UserEntity, 'id' | 'roles'>> {
        return { id: payload.sub, roles: payload.roles }
    }
}
