import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { PassportUserDto } from '../../auth/dto/passport-user.dto'

export const CurrentUser = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest()
        const user: PassportUserDto = request.user

        return data ? user?.[data] : user
    }
)
