import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
    UnprocessableEntityException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, TypeORMError } from 'typeorm'

import { QuizEntity } from './quiz.entity'
import { UpdateQuizDto } from './dto/update-quiz.dto'
import { CategoryEntity } from './categories/category.entity'
import { QuestionEntity } from './questions/question.entity'
import { AnswerEntity } from './answers/answer.entity'
import { UserEntity } from '../users/entities/user.entity'
import { IsActiveDto } from './dto/isActive.dto'
import { CreateQuizDto } from './dto/create-quiz.dto'
import { PassportUserDto } from '../auth/dto/passport-user.dto'

@Injectable()
export class QuizzesService {
    @InjectRepository(QuizEntity)
    private readonly quizzesRepository: Repository<QuizEntity>

    async create(userId: string, payload: CreateQuizDto) {
        const user = new UserEntity({ id: userId })

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

        const quiz = this.quizzesRepository.create()
        quiz.user = user
        quiz.text = payload.text
        quiz.description = payload.description
        quiz.category = new CategoryEntity({
            name: payload.category.name
        })
        quiz.questions = questions

        const response = await this.quizzesRepository.save(quiz)

        return response
    }

    findAll() {
        return this.quizzesRepository.find({
            select: {
                user: {
                    id: true,
                    firstName: true,
                    lastName: true
                },
                category: {
                    name: true,
                    id: true
                }
            },
            where: { isActive: true },
            relations: ['category', 'user'],
            loadEagerRelations: false
        })
    }

    async findOne(id: string) {
        const quiz = await this.quizzesRepository.findOne({
            where: { id }
        })

        if (!quiz) {
            throw new NotFoundException()
        }

        quiz.user = new UserEntity(quiz.user)

        return quiz
    }

    async update(id: string, payload: UpdateQuizDto, user: PassportUserDto) {
        const quiz = await this.quizzesRepository.findOne({
            where: { id, user: { id: user.id } },
            relations: ['category', 'user'],
            loadEagerRelations: false
        })

        if (!quiz) {
            throw new NotFoundException()
        }

        try {
            await this.quizzesRepository.update({ id }, payload)
        } catch (error) {
            if (error instanceof TypeORMError) {
                if (error.message.includes('FK_'))
                    throw new BadRequestException('category not exist')
                throw new ConflictException()
            }

            throw new UnprocessableEntityException(error.message)
        }

        const quizUpdated = this.quizzesRepository.merge(quiz, payload)

        return quizUpdated
    }

    async remove(id: string, user: PassportUserDto) {
        const quiz = await this.quizzesRepository.exists({
            where: { id, user: { id: user.id } }
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
