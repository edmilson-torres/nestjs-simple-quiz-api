import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm'

import { AnswerEntity } from '../answers/answer.entity'
import { UserEntity } from '../../users/entities/user.entity'
import { QuizEntity } from '../quiz.entity'

@Entity({ name: 'question' })
export class QuestionEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    text: string

    @ManyToOne(() => QuizEntity, {
        onDelete: 'CASCADE'
    })
    quiz: QuizEntity

    @ManyToOne(() => UserEntity)
    user: UserEntity

    @OneToMany(() => AnswerEntity, (answer) => answer.question, {
        eager: true,
        cascade: true
    })
    answers: AnswerEntity[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    constructor(partial: Partial<QuestionEntity>) {
        super()
        Object.assign(this, partial)
    }
}
