import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import {
    BadRequestException,
    Injectable,
    UnauthorizedException
} from '@nestjs/common'
import { AuthService } from '../auth.service'
import { validate } from 'class-validator'
import { LoginDto } from '../dto/login.dto'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({ usernameField: 'email' })
    }

    async validate(email: string, password: string): Promise<any> {
        const loginDto = new LoginDto()
        loginDto.email = email
        loginDto.password = password

        const errors = await validate(loginDto)
        if (errors.length > 0) {
            const constraints = []

            for (const error of errors) {
                constraints.push(
                    error.constraints ? Object.values(error.constraints) : []
                )
            }

            throw new BadRequestException(constraints.toString())
        }

        const user = await this.authService.validateUser(email, password)
        if (!user) {
            throw new UnauthorizedException()
        }
        return user
    }
}
