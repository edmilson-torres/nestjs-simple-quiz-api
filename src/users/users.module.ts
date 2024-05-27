import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { DatabaseModule } from '../database/database.module'
import { userProviders } from './users.providers'
import { HashModule } from '../shared/hash/hash.module'

@Module({
    imports: [DatabaseModule, HashModule],
    controllers: [UsersController],
    providers: [...userProviders, UsersService],
    exports: [UsersService]
})
export class UsersModule {}
