import { ConfigService } from '@nestjs/config'
import { config } from 'dotenv'
config()

const configService = new ConfigService()
const secret = configService.getOrThrow<string>('AUTH_JWT_SECRET', {
    infer: true
})
const expires = configService.getOrThrow<string>('AUTH_JWT_TOKEN_EXPIRES_IN', {
    infer: true
})
const refreshSecret = configService.getOrThrow<string>('AUTH_REFRESH_SECRET', {
    infer: true
})
const refreshExpires = configService.getOrThrow<string>(
    'AUTH_REFRESH_TOKEN_EXPIRES_IN',
    {
        infer: true
    }
)

export const jwtConstants = {
    secret,
    expires,
    refreshSecret,
    refreshExpires
}
