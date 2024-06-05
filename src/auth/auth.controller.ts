import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UseGuards
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'

import { AuthService, UserTokens } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(AuthGuard('local'))
    @HttpCode(HttpStatus.OK)
    @Post('/login')
    async login(@Request() req, @Body() payload: LoginDto) {
        return this.authService.login({
            id: req.user.id,
            email: payload.email,
            roles: req.user.roles
        })
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    getProfile(@Request() req) {
        return req.user
    }

    @Post('refresh')
    @UseGuards(AuthGuard('jwt-refresh'))
    @HttpCode(HttpStatus.OK)
    refreshTokens(@Body() payload: RefreshTokenDto): Promise<UserTokens> {
        return this.authService.refreshTokens(payload.refresh_token)
    }
}
