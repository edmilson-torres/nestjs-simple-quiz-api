import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { ServerCaslService } from './casl.service'
import { Casl } from './casl.decorator'

@Injectable()
export class CaslGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly service: ServerCaslService
    ) {}

    canActivate(context: ExecutionContext) {
        const [action, expectedSubject] = this.reflector.getAllAndOverride(
            Casl,
            [context.getHandler(), context.getClass()]
        )

        const req = context.switchToHttp().getRequest()
        const { user } = req

        return this.service
            .buildAbilityForUser(user)
            .can(action, expectedSubject)
    }
}
