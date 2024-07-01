import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserEntity } from './entities/user.entity'
import { RolesEnum } from './entities/roles.enum'
import { HashService } from '../shared/hash/hash.service'
import { isAdmin } from './helpers/isAdmin'

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly usersRepository: Repository<UserEntity>,
        private readonly hashing: HashService
    ) {}

    async create(payload: CreateUserDto): Promise<Partial<UserEntity>> {
        payload.roles = [RolesEnum.User]

        const password = await this.hashing.hash(payload.password)

        const createUserData = this.usersRepository.create({
            ...payload,
            password
        })

        try {
            const newUser = await this.usersRepository.save(createUserData)

            return new UserEntity(newUser)
        } catch (error) {
            throw new ConflictException('Invalid Data')
        }
    }

    async findAll(): Promise<UserEntity[]> {
        return this.usersRepository.find({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                roles: true
            }
        })
    }

    async findOne(id: string, reqUser: Partial<UserEntity>) {
        const admin = isAdmin(reqUser.roles)

        if (admin || reqUser.id === id) {
            const user = await this.usersRepository.findOne({
                where: { id }
            })

            if (!user) {
                throw new NotFoundException()
            }

            return new UserEntity(user)
        } else {
            throw new ForbiddenException()
        }
    }

    async findOneByEmail(email: string) {
        try {
            const user = await this.usersRepository.findOne({
                where: { email },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    roles: true,
                    password: true,
                    refreshToken: true
                }
            })

            return user
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async findOneById(id: string) {
        const user = await this.usersRepository.findOne({
            where: { id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                roles: true,
                password: true,
                refreshToken: true
            }
        })

        if (!user) {
            throw new NotFoundException()
        }

        return new UserEntity(user)
    }

    async update(
        id: string,
        payload: UpdateUserDto,
        reqUser: Partial<UserEntity>
    ): Promise<Partial<UserEntity> | null> {
        const admin = isAdmin(reqUser.roles)

        if (admin || reqUser.id === id) {
            const user = await this.usersRepository.findOne({
                where: { id }
            })

            if (!user) {
                throw new NotFoundException()
            }

            if (payload.email) {
                const userObject = await this.usersRepository.findOne({
                    where: { email: payload.email }
                })

                if (userObject && userObject.id !== id) {
                    throw new BadRequestException('Invalid data')
                }
            }

            let passwordHash: string
            if (payload.password) {
                passwordHash = await this.hashing.hash(payload.password)
            }

            if (!admin) {
                payload.roles = undefined
            }

            const updateData: Partial<UserEntity> = new UserEntity({
                ...payload,
                password: passwordHash
            })

            try {
                await this.usersRepository.update(id, updateData)

                return new UserEntity({ id, ...user, ...updateData })
            } catch (error) {
                throw new Error(error)
            }
        } else {
            throw new ForbiddenException()
        }
    }

    async remove(id: string, reqUser: Partial<UserEntity>) {
        const admin = isAdmin(reqUser.roles)

        if (admin || reqUser.id === id) {
            const user = await this.usersRepository.exists({
                where: { id }
            })

            if (!user) {
                throw new NotFoundException()
            }

            const passwordString = Math.random().toString(36).slice(-8)
            const passwordHash = await this.hashing.hash(passwordString)

            await this.usersRepository.update(id, { password: passwordHash })

            await this.usersRepository.softDelete(id)

            return null
        } else {
            throw new ForbiddenException()
        }
    }

    async updateRefreshToken(id: string, signature: string): Promise<void> {
        const signatureHash = await this.hashing.hash(signature)

        const updateData: Partial<UserEntity> = new UserEntity({
            refreshToken: signatureHash
        })

        try {
            await this.usersRepository.update(id, updateData)
        } catch (error) {
            throw new Error(error.message)
        }
    }
}
