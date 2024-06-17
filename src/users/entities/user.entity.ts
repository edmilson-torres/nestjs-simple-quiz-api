import { Exclude } from 'class-transformer'
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
import { QuizEntity } from '../../quizzes/entities/quiz.entity'

export enum RolesEnum {
    User = 'user',
    Admin = 'admin',
    Moderator = 'moderator'
}

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    @Index({ where: '"deletedAt" IS NULL', unique: true })
    email: string

    @Column({
        type: 'enum',
        enum: RolesEnum,
        array: true,
        default: [RolesEnum.User]
    })
    roles: RolesEnum[]

    @Column()
    @Exclude({ toPlainOnly: true })
    password: string

    @Column({ default: null })
    @Exclude({ toPlainOnly: true })
    refreshToken: string

    @OneToMany(() => QuizEntity, (quiz) => quiz.user)
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

    constructor(partial: Partial<UserEntity>) {
        super()
        Object.assign(this, partial)
    }
}
