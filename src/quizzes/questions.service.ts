import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, TypeORMError } from 'typeorm'

import { QuestionEntity } from './entities/question.entity'
import { CreateQuestionDto } from './dto/create-question.dto'
import { UpdateQuestionDto } from './dto/update-question.dto'

@Injectable()
export class QuestionsService {
    @InjectRepository(QuestionEntity)
    private readonly questionsRepository: Repository<QuestionEntity>

    async create(payload: CreateQuestionDto) {
        const question = this.questionsRepository.create(payload)

        try {
            const newQuestion = await this.questionsRepository.save(question)

            return new QuestionEntity(newQuestion)
        } catch (error) {
            if (error instanceof TypeORMError) throw new ConflictException()

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
        const questionChecked = await this.questionsRepository.exists({
            where: { id }
        })

        if (!questionChecked) {
            throw new NotFoundException()
        }

        const question = this.questionsRepository.create(payload)

        return this.questionsRepository.update({ id }, question)
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
