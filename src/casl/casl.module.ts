import { Module } from '@nestjs/common'
import { ServerCaslService } from './casl.service'

@Module({
    controllers: [],
    providers: [ServerCaslService],
    exports: [ServerCaslService]
})
export class ServerCaslModule {}
