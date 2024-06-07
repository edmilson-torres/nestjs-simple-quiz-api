import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'

import { DatabaseModule } from './database/database.module'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { HashModule } from './shared/hash/hash.module'
import { QuizzesModule } from './quizzes/quizzes.module'

@Module({
    imports: [
        DatabaseModule,
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
        AuthModule,
        UsersModule,
        HashModule,
        QuizzesModule
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
