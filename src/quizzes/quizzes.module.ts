import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { QuizzesService } from './quizzes.service'
import { QuizzesController } from './quizzes.controller'
import { QuizEntity } from './entities/quiz.entity'
import { CategoryEntity } from './entities/category.entity'
import { QuestionEntity } from './entities/question.entity'
import { AnswerEntity } from './entities/answer.entity'
import { DatabaseModule } from '../database/database.module'
import { CategoriesController } from './categories.controller'
import { CategoriesService } from './categories.service'
import { JwtService } from '@nestjs/jwt'
import { QuestionsController } from './questions.controller'
import { AnswerController } from './answers.controller'
import { QuestionsService } from './questions.service'
import { AnswerService } from './answers.service'

@Module({
    imports: [
        TypeOrmModule.forFeature([
            QuizEntity,
            CategoryEntity,
            QuestionEntity,
            AnswerEntity
        ]),
        DatabaseModule
    ],
    controllers: [
        QuizzesController,
        CategoriesController,
        QuestionsController,
        AnswerController
    ],
    providers: [
        QuizzesService,
        CategoriesService,
        JwtService,
        QuestionsService,
        AnswerService
    ]
})
export class QuizzesModule {}
