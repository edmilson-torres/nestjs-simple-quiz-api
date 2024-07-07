import { Exclude, Expose } from 'class-transformer'
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    UpdateDateColumn,
    Index,
    BaseEntity,
    OneToMany
} from 'typeorm'
import { QuizEntity } from '../../quizzes/quiz.entity'
import { RoleEnum } from './role.enum'
import { AnswerEntity } from '../../quizzes/answers/answer.entity'
import { QuestionEntity } from '../../quizzes/questions/question.entity'

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    @Expose({ groups: ['all'] })
    id: string

    @Column()
    @Expose({ groups: ['all'] })
    firstName: string

    @Column()
    @Expose({ groups: ['all'] })
    lastName: string

    @Column()
    @Expose({ groups: ['self'] })
    @Index({ where: '"deletedAt" IS NULL', unique: true })
    email: string

    @Column({
        type: 'enum',
        enum: RoleEnum,
        default: RoleEnum.User
    })
    @Expose({ groups: ['self'] })
    role: RoleEnum

    @Column()
    @Exclude({ toPlainOnly: true })
    password: string

    @Column({ default: null })
    @Exclude({ toPlainOnly: true })
    refreshToken: string

    @OneToMany(() => QuizEntity, (quiz) => quiz.user)
    quizzes: QuizEntity[]

    @OneToMany(() => QuestionEntity, (question) => question.user)
    questions: QuestionEntity[]

    @OneToMany(() => AnswerEntity, (answer) => answer.user)
    answers: AnswerEntity[]

    @CreateDateColumn()
    @Expose({ groups: ['self'] })
    createdAt: Date

    @UpdateDateColumn()
    @Expose({ groups: ['self'] })
    updatedAt: Date

    @DeleteDateColumn()
    @Exclude()
    deletedAt: Date

    constructor(partial: Partial<UserEntity>) {
        super()
        Object.assign(this, partial)
    }
}
