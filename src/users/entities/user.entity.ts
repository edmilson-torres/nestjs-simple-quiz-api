import { Exclude } from 'class-transformer'
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    UpdateDateColumn,
    Index
} from 'typeorm'

export enum Role {
    User = 'user',
    Admin = 'admin'
}

@Entity({ name: 'user' })
export class UserEntity {
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
        enum: Role,
        array: true,
        default: [Role.User]
    })
    roles?: Role[]

    @Column()
    @Exclude({ toPlainOnly: true })
    password: string

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
        Object.assign(this, partial)
    }
}
