import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { PassportUser } from '../types/passport-user.type'

export const GetCurrentUser = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest()
        const user: PassportUser = request.user

        return data ? user?.[data] : user
    }
)
