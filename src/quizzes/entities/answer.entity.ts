import { Exclude } from 'class-transformer'
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
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
    @Exclude()
    createdAt: Date

    @UpdateDateColumn()
    @Exclude()
    updatedAt: Date

    @DeleteDateColumn()
    @Exclude()
    deletedAt: Date

    constructor(partial: Partial<AnswerEntity>) {
        super()
        Object.assign(this, partial)
    }
}
