import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { HashModule } from '../shared/hash/hash.module'
import { UserEntity } from './entities/user.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'
import { ServerCaslModule } from '../casl/casl.module'

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        HashModule,
        ServerCaslModule
    ],
    controllers: [UsersController],
    providers: [UsersService, JwtService],
    exports: [UsersService]
})
export class UsersModule {}
