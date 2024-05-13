import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import { UpdateUserDto } from './dto/update-user.dto'
import { genSalt, hash } from 'bcryptjs'

@Injectable()
export class UsersService {
    constructor(
        @Inject('USER_REPOSITORY')
        private userRepository: Repository<User>
    ) {}

    async create(payload: CreateUserDto) {
        const userClone = { passwordHash: '123456', ...payload }

        const result = this.userRepository.save(userClone)
        return result
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find({
            select: { id: true, firstName: true, lastName: true, email: true }
        })
    }

    async findOne(id: string) {
        const user = await this.userRepository.findOne({
            where: { id },
            select: { id: true, firstName: true, lastName: true, email: true }
        })

        if (!user) {
            throw new NotFoundException()
        }

        return user
    }

    async update(
        id: string,
        payload: UpdateUserDto
    ): Promise<Partial<User> | null> {
        const user = await this.userRepository.findOne({
            where: { id, deletedAt: null }
        })

        if (!user) {
            throw new NotFoundException()
        }

        let tempData: Partial<User> = {}

        tempData = { ...user, ...payload }

        if (payload.password) {
            const salt = await genSalt()
            tempData.passwordHash = await hash(payload.password, salt)
        }

        const updateData: Partial<User> = {
            firstName: tempData.firstName,
            lastName: tempData.lastName,
            email: tempData.email,
            passwordHash: tempData.passwordHash
        }

        try {
            await this.userRepository.update(id, updateData)

            return { id }
        } catch (error) {
            throw new Error(error)
        }
    }

    async remove(id: string) {
        const user = await this.userRepository.findOne({
            where: { id, deletedAt: null }
        })

        if (!user) {
            throw new NotFoundException()
        }

        await this.userRepository.softDelete(id)
        return null
    }
}
