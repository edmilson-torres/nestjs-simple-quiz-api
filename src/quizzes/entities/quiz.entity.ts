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
import { UserEntity } from '../../users/entities/user.entity'
import { CategoryEntity } from './category.entity'
import { QuestionEntity } from './question.entity'

@Entity({ name: 'quiz' })
export class QuizEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    text: string

    @Column()
    description?: string

    @Column({ default: true })
    isActive?: boolean

    @ManyToOne(() => UserEntity)
    user: UserEntity

    @ManyToOne(() => CategoryEntity, {
        eager: true,
        cascade: true,
        onDelete: 'NO ACTION'
    })
    category: CategoryEntity

    @OneToMany(() => QuestionEntity, (question) => question.quiz, {
        eager: true,
        cascade: true
    })
    questions: QuestionEntity[]

    @CreateDateColumn()
    @Exclude()
    createdAt: Date

    @UpdateDateColumn()
    @Exclude()
    updatedAt: Date

    @DeleteDateColumn()
    @Exclude()
    deletedAt: Date

    constructor(partial: Partial<QuizEntity>) {
        super()
        Object.assign(this, partial)
    }
}
