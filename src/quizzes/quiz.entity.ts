import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    Index,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm'
import { UserEntity } from '../users/entities/user.entity'
import { CategoryEntity } from './categories/category.entity'
import { QuestionEntity } from './questions/question.entity'

@Entity({ name: 'quiz' })
export class QuizEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    text: string

    @Column({ default: null })
    description?: string

    @Column({ default: true })
    isActive?: boolean

    @ManyToOne(() => UserEntity, { eager: true })
    user: UserEntity

    @ManyToOne(() => CategoryEntity, (category) => category.quizzes, {
        eager: true,
        cascade: true
    })
    @Index()
    category: CategoryEntity

    @OneToMany(() => QuestionEntity, (question) => question.quiz, {
        eager: true,
        cascade: true
    })
    questions: QuestionEntity[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    constructor(partial: Partial<QuizEntity>) {
        super()
        Object.assign(this, partial)
    }
}
