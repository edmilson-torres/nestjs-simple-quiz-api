import { Exclude } from 'class-transformer'
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm'
import { QuizEntity } from './quiz.entity'

@Entity({ name: 'category' })
export class CategoryEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @OneToMany(() => QuizEntity, (quiz) => quiz.category)
    quizzes: QuizEntity[]

    @CreateDateColumn()
    @Exclude()
    createdAt: Date

    @UpdateDateColumn()
    @Exclude()
    updatedAt: Date

    @DeleteDateColumn()
    @Exclude()
    deletedAt: Date

    constructor(partial: Partial<CategoryEntity>) {
        super()
        Object.assign(this, partial)
    }
}
