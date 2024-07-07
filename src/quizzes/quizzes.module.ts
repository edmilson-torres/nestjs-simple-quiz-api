import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { QuizzesService } from './quizzes.service'
import { QuizzesController } from './quizzes.controller'
import { QuizEntity } from './quiz.entity'
import { CategoryEntity } from './categories/category.entity'
import { QuestionEntity } from './questions/question.entity'
import { AnswerEntity } from './answers/answer.entity'
import { DatabaseModule } from '../database/database.module'
import { CategoriesController } from './categories/categories.controller'
import { CategoriesService } from './categories/categories.service'
import { JwtService } from '@nestjs/jwt'
import { QuestionsController } from './questions/questions.controller'
import { AnswerController } from './answers/answers.controller'
import { QuestionsService } from './questions/questions.service'
import { AnswerService } from './answers/answers.service'
import { ServerCaslModule } from '../casl/casl.module'
import { AnswersModule } from './answers/answers.module'
import { QuestionsModule } from './questions/questions.module'
import { CategoriesModule } from './categories/categories.module'

@Module({
    imports: [
        TypeOrmModule.forFeature([
            QuizEntity,
            CategoryEntity,
            QuestionEntity,
            AnswerEntity
        ]),
        DatabaseModule,
        ServerCaslModule,
        AnswersModule,
        QuestionsModule,
        CategoriesModule
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
