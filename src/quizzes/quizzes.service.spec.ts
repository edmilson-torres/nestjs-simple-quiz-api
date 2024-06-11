import { Test, TestingModule } from '@nestjs/testing'
import { QuizzesService } from './quizzes.service'
import { QuizEntity } from './entities/quiz.entity'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

describe('QuizzesService', () => {
    let service: QuizzesService
    let repository: Repository<QuizEntity>

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                QuizzesService,
                {
                    provide: getRepositoryToken(QuizEntity),
                    useValue: {
                        remove: jest.fn(),
                        exists: jest.fn()
                    }
                }
            ]
        }).compile()

        service = module.get<QuizzesService>(QuizzesService)
        repository = module.get<Repository<QuizEntity>>(
            getRepositoryToken(QuizEntity)
        )
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    it('should remove a quiz by id', () => {
        jest.spyOn(repository, 'exists').mockReturnValue(Promise.resolve(true))

        expect(service.remove('1')).toBeNull()
    })
})
