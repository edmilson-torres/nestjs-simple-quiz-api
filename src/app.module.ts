import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { UsersModule } from './users/users.module'
import { HashModule } from './shared/hash/hash.module'
import { AuthModule } from './auth/auth.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        ThrottlerModule.forRoot([
            {
                name: 'short',
                ttl: 1000,
                limit: 3
            },
            {
                name: 'medium',
                ttl: 10000,
                limit: 20
            },
            {
                name: 'long',
                ttl: 60000,
                limit: 100
            }
        ]),
        UsersModule,
        HashModule,
        AuthModule
    ],
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        }
    ]
})
export class AppModule {}
