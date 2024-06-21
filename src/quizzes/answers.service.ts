import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, TypeORMError } from 'typeorm'

import { AnswerEntity } from './entities/answer.entity'
import { AnswerDto } from './dto/answer.dto'

@Injectable()
export class AnswerService {
    @InjectRepository(AnswerEntity)
    private readonly answersRepository: Repository<AnswerEntity>

    async create(payload: AnswerDto) {
        const answer = this.answersRepository.create(payload)

        try {
            const newAnswer = await this.answersRepository.save(answer)

            return new AnswerEntity(newAnswer)
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async findOne(id: string) {
        const foundedAnswer = await this.answersRepository.findOne({
            where: { id }
        })

        if (!foundedAnswer) {
            throw new NotFoundException()
        }

        return new AnswerEntity(foundedAnswer)
    }

    findAll() {
        return this.answersRepository.find()
    }

    async update(id: string, payload: AnswerDto) {
        const answerChecked = await this.answersRepository.exists({
            where: { id }
        })

        if (!answerChecked) {
            throw new NotFoundException()
        }

        const answer = this.answersRepository.create(payload)

        return this.answersRepository.update({ id }, answer)
    }

    async remove(id: string) {
        const answerChecked = await this.answersRepository.exists({
            where: { id }
        })

        if (!answerChecked) {
            throw new NotFoundException()
        }

        try {
            await this.answersRepository.delete(id)
        } catch (error) {
            if (error instanceof TypeORMError) throw new ConflictException()
        }

        return null
    }
}
