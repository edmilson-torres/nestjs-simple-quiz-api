import { Test, TestingModule } from '@nestjs/testing'
import { QuizzesController } from './quizzes.controller'
import { QuizzesService } from './quizzes.service'

describe('QuizzesController', () => {
    let quizzesController: QuizzesController
    let quizzesService: QuizzesService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [QuizzesController],
            providers: [
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
        quizzesController.remove('1')
        expect(quizzesService.remove).toHaveBeenCalled()
    })
})
