import { Exclude } from 'class-transformer'
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm'
import { QuizEntity } from './quiz.entity'
import { AnswerEntity } from './answer.entity'

@Entity({ name: 'question' })
export class QuestionEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    question: string

    @ManyToOne(() => QuizEntity, {
        onDelete: 'CASCADE'
    })
    quiz: QuizEntity

    @OneToMany(() => AnswerEntity, (answer) => answer.question, {
        eager: true,
        cascade: true,
        onDelete: 'CASCADE'
    })
    answers: AnswerEntity[]

    @CreateDateColumn()
    @Exclude()
    createdAt: Date

    @UpdateDateColumn()
    @Exclude()
    updatedAt: Date

    @DeleteDateColumn()
    @Exclude()
    deletedAt: Date

    constructor(partial: Partial<QuestionEntity>) {
        super()
        Object.assign(this, partial)
    }
}
