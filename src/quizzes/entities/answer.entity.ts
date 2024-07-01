import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm'
import { QuestionEntity } from './question.entity'
import { UserEntity } from '../../users/entities/user.entity'

@Entity({ name: 'answer' })
export class AnswerEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    text: string

    @Column({ default: false })
    isCorrect?: boolean

    @ManyToOne(() => QuestionEntity, {
        onDelete: 'CASCADE'
    })
    question: QuestionEntity

    @ManyToOne(() => UserEntity)
    user: UserEntity

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    constructor(partial: Partial<AnswerEntity>) {
        super()
        Object.assign(this, partial)
    }
}
