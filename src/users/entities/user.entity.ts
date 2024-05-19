import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    UpdateDateColumn,
    Index
} from 'typeorm'

@Entity({ name: 'user' })
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    @Index({ where: '"deletedAt" IS NULL', unique: true })
    email: string

    @Column({ default: 'user' })
    role: string

    @Column()
    passwordHash: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}
