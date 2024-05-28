import { ConfigService } from '@nestjs/config'
import { config } from 'dotenv'
config()

const configService = new ConfigService()
const secret = configService.get<string>('SECRET_KEY')

export const jwtConstants = {
    secret
}
