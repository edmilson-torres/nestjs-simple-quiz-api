import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'

import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { HashModule } from './shared/hash/hash.module'
import { TypeOrmModule } from '@nestjs/typeorm'

import { typeOrmConfig } from './database/database.config'
import { QuizzesModule } from './quizzes/quizzes.module'

@Module({
    imports: [
        TypeOrmModule.forRoot(typeOrmConfig),
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
        AuthModule,
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
