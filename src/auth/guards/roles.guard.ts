import { Reflector } from '@nestjs/core'
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'

import { ROLE_KEY } from '../decorators/role.decorator'
import { RoleEnum } from '../../users/entities/role.enum'

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
            ROLE_KEY,
            [context.getHandler(), context.getClass()]
        )

        if (!requiredRoles) {
            return true
        }

        const { user } = context.switchToHttp().getRequest()

        return requiredRoles.some((role) => user.role === role)
    }
}
