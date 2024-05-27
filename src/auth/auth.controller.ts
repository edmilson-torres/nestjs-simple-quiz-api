import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { AuthService } from './auth.service'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { LoginDto } from './dto/login.dto'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Body() data: LoginDto) {
        const passwordHash = data.password

        return this.authService.login({
            email: data.email,
            passwordHash
        })
    }
}
