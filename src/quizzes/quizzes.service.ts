import {
    ConflictException,
    Injectable,
    NotFoundException,
    UnprocessableEntityException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, TypeORMError } from 'typeorm'

import { QuizEntity } from './entities/quiz.entity'
import { UpdateQuizDto } from './dto/update-quiz.dto'
import { CategoryEntity } from './entities/category.entity'
import { QuestionEntity } from './entities/question.entity'
import { AnswerEntity } from './entities/answer.entity'
import { UserEntity } from '../users/entities/user.entity'
import { IsActiveDto } from './dto/isActive.dto'
import { CreateQuizDto } from './dto/create-quiz.dto'

@Injectable()
export class QuizzesService {
    @InjectRepository(QuizEntity)
    private readonly quizzesRepository: Repository<QuizEntity>

    async create(userId: string, payload: CreateQuizDto) {
        const user = new UserEntity({ id: userId })
        const quiz = this.quizzesRepository.create(payload)

        quiz.user = user
        quiz.text = payload.text
        quiz.description = payload.description
        quiz.category = new CategoryEntity({ name: payload.category.name })

        const questions: QuestionEntity[] = []
        payload.questions.forEach((question: QuestionEntity) => {
            const answers: AnswerEntity[] = []
            question.answers.forEach((answer: AnswerEntity) => {
                answer.user = user
                answers.push(new AnswerEntity(answer))
            })

            question.user = user
            questions.push(new QuestionEntity({ ...question, answers }))
        })

        quiz.questions = questions

        const response = await this.quizzesRepository.save(quiz)

        return response
    }

    findAll() {
        return this.quizzesRepository.find({
            where: { isActive: true },
            relations: ['category'],
            loadEagerRelations: false
        })
    }

    async findOne(id: string) {
        const quiz = await this.quizzesRepository.findOne({ where: { id } })

        if (!quiz) {
            throw new NotFoundException()
        }
        return quiz
    }

    async update(id: string, payload: UpdateQuizDto) {
        const quiz = await this.quizzesRepository.findOne({
            where: { id },
            relations: ['category'],
            loadEagerRelations: false
        })

        if (!quiz) {
            throw new NotFoundException()
        }

        try {
            await this.quizzesRepository.update({ id }, payload)
        } catch (error) {
            if (error instanceof TypeORMError) throw new ConflictException()

            throw new UnprocessableEntityException(error.message)
        }

        const quizUpdated = this.quizzesRepository.merge(quiz, payload)

        return quizUpdated
    }

    async remove(id: string) {
        const quiz = await this.quizzesRepository.exists({
            where: { id }
        })

        if (!quiz) {
            throw new NotFoundException()
        }

        try {
            await this.quizzesRepository.delete(id)
        } catch (error) {
            if (error instanceof TypeORMError) throw new ConflictException()

            throw new UnprocessableEntityException(error.message)
        }

        return null
    }

    async isActive(id: string, isActive: IsActiveDto) {
        const quiz = await this.quizzesRepository.exists({
            where: { id }
        })

        if (!quiz) {
            throw new NotFoundException()
        }

        try {
            await this.quizzesRepository.update({ id }, isActive)
        } catch (error) {
            if (error instanceof TypeORMError) throw new ConflictException()

            throw new UnprocessableEntityException(error.message)
        }

        return new QuizEntity({ id, ...isActive })
    }
}
