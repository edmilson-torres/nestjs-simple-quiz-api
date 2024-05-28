import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'

import { HashModule } from '../shared/hash/hash.module'
import { UsersModule } from '../users/users.module'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { LocalStrategy } from './strategies/local.strategy'
import { jwtConstants } from './constants'
import { JwtStrategy } from './strategies/jwt.strategy'

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '60h' }
        }),
        HashModule
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy]
})
export class AuthModule {}
