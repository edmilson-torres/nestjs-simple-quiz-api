import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, TypeORMError } from 'typeorm'

import { PassportUserDto } from '../../auth/dto/passport-user.dto'
import { UserEntity } from '../../users/entities/user.entity'
import { QuestionEntity } from './question.entity'
import { CreateQuestionDto, UpdateQuestionDto } from './question.dto'
import { QuizEntity } from '../quiz.entity'

@Injectable()
export class QuestionsService {
    @InjectRepository(QuestionEntity)
    private readonly questionsRepository: Repository<QuestionEntity>

    @InjectRepository(QuizEntity)
    private readonly quizzesRepository: Repository<QuizEntity>

    async create(payload: CreateQuestionDto, userDto: PassportUserDto) {
        const quiz = await this.quizzesRepository.findOne({
            where: { id: payload.quiz }
        })

        if (!quiz) throw new NotFoundException('Quiz not found')

        if (quiz.user.id !== userDto.id) throw new ForbiddenException()

        const user = new UserEntity({ id: userDto.id })

        const question = this.questionsRepository.create({
            ...payload,
            quiz
        })
        question.user = user

        try {
            const newQuestion = await this.questionsRepository.save(question)

            return new QuestionEntity(newQuestion)
        } catch (error) {
            if (error instanceof TypeORMError) {
                if (error.message.includes('FK_'))
                    throw new BadRequestException('quiz not exist')
                throw new ConflictException()
            }

            throw new BadRequestException(error.message)
        }
    }

    async findOne(id: string) {
        const foundedQuestion = await this.questionsRepository.findOne({
            where: { id },
            relations: ['quiz'],
            loadEagerRelations: false
        })

        if (!foundedQuestion) {
            throw new NotFoundException()
        }

        return foundedQuestion
    }

    findAll() {
        return this.questionsRepository.find()
    }

    async update(
        id: string,
        payload: UpdateQuestionDto,
        userDto: PassportUserDto
    ) {
        const question = await this.questionsRepository.findOne({
            where: { id },
            relations: ['user'],
            loadEagerRelations: false
        })

        if (!question) {
            throw new NotFoundException()
        }

        if (question.user.id !== userDto.id) throw new ForbiddenException()

        const questionUpdate = this.questionsRepository.create({
            id,
            text: payload.text
        })

        try {
            await this.questionsRepository.update(id, questionUpdate)

            return this.questionsRepository.merge(question, questionUpdate)
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async remove(id: string, userDto: PassportUserDto) {
        const question = await this.questionsRepository.findOne({
            where: { id },
            relations: ['user'],
            loadEagerRelations: false
        })

        if (!question) {
            throw new NotFoundException()
        }

        if (question.user.id !== userDto.id) throw new ForbiddenException()

        try {
            await this.questionsRepository.delete(id)
        } catch (error) {
            if (error instanceof TypeORMError) throw new ConflictException()
        }

        return null
    }
}
