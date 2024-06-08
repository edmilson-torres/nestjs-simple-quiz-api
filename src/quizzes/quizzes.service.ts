import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { QuizEntity } from './entities/quiz.entity'
import { CreateQuizDto } from './dto/create-quiz.dto'
import { UpdateQuizDto } from './dto/update-quiz.dto'
import { CategoryEntity } from './entities/category.entity'
import { QuestionEntity } from './entities/question.entity'
import { AnswerEntity } from './entities/answer.entity'

@Injectable()
export class QuizzesService {
    @InjectRepository(QuizEntity)
    private readonly quizzesRepository: Repository<QuizEntity>

    create(payload: CreateQuizDto) {
        const quiz = this.quizzesRepository.create()
        quiz.text = payload.text
        quiz.description = payload.description
        quiz.category = new CategoryEntity({ category: payload.category })

        const questions = []
        payload.questions.forEach((questionItem) => {
            const answers = []
            questionItem.answers.forEach((answersItem) => {
                answers.push(new AnswerEntity(answersItem))
            })

            questions.push(
                new QuestionEntity({ question: questionItem.question, answers })
            )
        })

        quiz.questions = questions

        const response = this.quizzesRepository.save(quiz)

        return response
    }

    findAll() {
        return this.quizzesRepository.find()
    }

    async findOne(id: string) {
        const quiz = await this.quizzesRepository.findOne({ where: { id } })

        if (!quiz) {
            throw new NotFoundException()
        }
        return quiz
    }

    update(id: number, updateQuizDto: UpdateQuizDto) {
        console.log(updateQuizDto)
        return `This action updates a #${id} quiz`
    }

    async remove(id: string) {
        const quiz = await this.quizzesRepository.exists({
            where: { id }
        })

        if (!quiz) {
            throw new NotFoundException()
        }

        return this.quizzesRepository.delete(id)
    }
}
