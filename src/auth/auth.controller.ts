import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { AuthService } from './auth.service'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { LoginDto } from './dto/login.dto'
import { JwtAuthGuard } from './guards/jwt-auth.guard'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Request() req, @Body() data: LoginDto) {
        const passwordHash = data.password

        return this.authService.login({
            id: req.user.id,
            email: data.email,
            passwordHash,
            roles: req.user.roles
        })
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user
    }
}
