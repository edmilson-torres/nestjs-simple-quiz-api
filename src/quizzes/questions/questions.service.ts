import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, TypeORMError } from 'typeorm'

import { PassportUserDto } from '../../auth/dto/passport-user.dto'
import { UserEntity } from '../../users/entities/user.entity'
import { AnswerEntity } from '../answers/answer.entity'
import { QuestionEntity } from './question.entity'
import { CreateQuestionDto, UpdateQuestionDto } from './question.dto'

@Injectable()
export class QuestionsService {
    @InjectRepository(QuestionEntity)
    private readonly questionsRepository: Repository<QuestionEntity>

    async create(payload: CreateQuestionDto, userDto: PassportUserDto) {
        const user = new UserEntity({ id: userDto.id })

        const answers: AnswerEntity[] = []
        payload.answers.forEach((answer: AnswerEntity) => {
            answer.user = user
            answers.push(new AnswerEntity(answer))
        })

        const question = this.questionsRepository.create(payload)
        question.user = user
        question.answers = answers

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
            where: { id }
        })

        if (!foundedQuestion) {
            throw new NotFoundException()
        }

        return new QuestionEntity(foundedQuestion)
    }

    findAll() {
        return this.questionsRepository.find()
    }

    async update(id: string, payload: UpdateQuestionDto) {
        const question = await this.questionsRepository.findOne({
            where: { id }
        })

        if (!question) {
            throw new NotFoundException()
        }

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

    async remove(id: string) {
        const questionChecked = await this.questionsRepository.exists({
            where: { id }
        })

        if (!questionChecked) {
            throw new NotFoundException()
        }

        try {
            await this.questionsRepository.delete(id)
        } catch (error) {
            if (error instanceof TypeORMError) throw new ConflictException()
        }

        return null
    }
}
