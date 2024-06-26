import { Test, TestingModule } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'

import { QuizzesController } from './quizzes.controller'
import { QuizzesService } from './quizzes.service'
import { PassportUserDto } from '../auth/dto/passport-user.dto'

describe('QuizzesController', () => {
    let quizzesController: QuizzesController
    let quizzesService: QuizzesService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [QuizzesController],
            providers: [
                JwtService,
                QuizzesService,
                {
                    provide: QuizzesService,
                    useValue: { remove: jest.fn() }
                }
            ]
        }).compile()

        quizzesController = module.get<QuizzesController>(QuizzesController)
        quizzesService = module.get<QuizzesService>(QuizzesService)
    })

    it('should be defined', () => {
        expect(quizzesController).toBeDefined()
    })

    it('should remove the quiz by id', () => {
        const user: PassportUserDto = {
            id: '',
            email: '',
            roles: []
        }

        quizzesController.remove('cc018e94-c33d-4208-b26c-c5cfa88b742f', user)

        expect(quizzesService.remove).toHaveBeenCalled()
    })
})
