import {
    ConflictException,
    Injectable,
    NotFoundException,
    UnprocessableEntityException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, TypeORMError } from 'typeorm'

import { QuizEntity } from './entities/quiz.entity'
import { CreateQuizDto } from './dto/create-quiz.dto'
import { UpdateQuizDto } from './dto/update-quiz.dto'
import { CategoryEntity } from './entities/category.entity'
import { QuestionEntity } from './entities/question.entity'
import { AnswerEntity } from './entities/answer.entity'
import { UserEntity } from '../users/entities/user.entity'
import { IsActiveDto } from './dto/isActive.dto'

@Injectable()
export class QuizzesService {
    @InjectRepository(QuizEntity)
    private readonly quizzesRepository: Repository<QuizEntity>

    create(id: string, payload: CreateQuizDto) {
        const quiz = this.quizzesRepository.create()
        quiz.user = new UserEntity({ id })
        quiz.text = payload.text
        quiz.description = payload.description
        quiz.category = new CategoryEntity({ name: payload.category.name })

        const questions = []
        payload.questions.forEach((questionItem) => {
            const answers = []
            questionItem.answers.forEach((answersItem) => {
                answers.push(new AnswerEntity(answersItem))
            })

            questions.push(
                new QuestionEntity({ text: questionItem.text, answers })
            )
        })

        quiz.questions = questions

        const response = this.quizzesRepository.save(quiz)

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
