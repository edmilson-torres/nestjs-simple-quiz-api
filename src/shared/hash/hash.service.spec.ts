import { Test, TestingModule } from '@nestjs/testing'
import { BcryptService } from './bcrypt.service'
import { HashService } from './hash.service'

describe('HashingService', () => {
    let service: HashService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: HashService,
                    useClass: BcryptService
                }
            ]
        }).compile()

        service = module.get<HashService>(HashService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
