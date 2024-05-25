import { Module } from '@nestjs/common'
import { HashService } from './hash.service'
import { BcryptService } from './bcrypt.service'

const hashProvider = {
    provide: HashService,
    useClass: BcryptService
}

@Module({
    providers: [hashProvider],
    exports: [HashService]
})
export class HashModule {}
