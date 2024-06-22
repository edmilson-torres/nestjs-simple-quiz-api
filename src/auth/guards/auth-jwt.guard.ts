import { Injectable, ExecutionContext } from '@nestjs/common'

import { IS_PUBLIC_KEY } from '../decorators/public.decorator'
import { AuthGuard } from '@nestjs/passport'
import { Reflector } from '@nestjs/core'

@Injectable()
export class AuthGuardJwt extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super()
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()]
        )

        if (isPublic) {
            return true
        }

        return super.canActivate(context)
    }
}
