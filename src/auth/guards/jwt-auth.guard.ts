import {
    ExecutionContext,
    Injectable,
    UnauthorizedException
} from '@nestjs/common'

import { JwtService } from '@nestjs/jwt'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly jwtService: JwtService) {
        super()
    }

    async canActivate(context: ExecutionContext) {
        const canActivate = await super.canActivate(context)
        if (!canActivate) {
            return false
        }

        const request = context.switchToHttp().getRequest()

        const token = request.headers.authorization?.split(' ')[1]
        if (!token) {
            throw new UnauthorizedException('No token provided')
        }

        const payload = this.jwtService.verify(token)

        if (!payload) {
            throw new UnauthorizedException('Insufficient permissions')
        }

        return true
    }
}
