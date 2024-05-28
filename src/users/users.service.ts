import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException
} from '@nestjs/common'
import { Repository } from 'typeorm'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'
import { UserMapper } from './users.mapper'
import { HashService } from '../shared/hash/hash.service'

import { Role } from 'src/auth/role.enum'
import { isAdmin } from 'src/shared/isAdmin'

@Injectable()
export class UsersService {
    constructor(
        @Inject('USER_REPOSITORY')
        private readonly usersRepository: Repository<User>,
        private readonly hashing: HashService
    ) {}

    async create(payload: CreateUserDto) {
        const userObject = await this.usersRepository.findOne({
            where: { email: payload.email }
        })
        if (userObject) {
            throw new BadRequestException('Invalid data')
        }

        const passwordHash = await this.hashing.hash(payload.password)

        payload.roles = [Role.User]

        const createData: Partial<User> = UserMapper.toPersistence({
            passwordHash,
            ...payload
        })

        try {
            const user = await this.usersRepository.save(createData)

            return UserMapper.toResponse(user)
        } catch (error) {
            throw new ConflictException('Invalid Data')
        }
    }

    async findAll(): Promise<User[]> {
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

    async findOne(id: string, reqUser: User) {
        const admin = isAdmin(reqUser.roles)

        if (admin || reqUser.id === id) {
            const user = await this.usersRepository.findOne({
                where: { id },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    roles: true
                }
            })
            if (!user) {
                throw new NotFoundException()
            }

            return user
        } else {
            throw new ForbiddenException()
        }
    }

    async findOneByEmail(email: string) {
        const user = await this.usersRepository.findOne({
            where: { email },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                roles: true,
                passwordHash: true
            }
        })

        if (!user) {
            throw new NotFoundException()
        }

        return user
    }

    async update(
        id: string,
        payload: UpdateUserDto,
        reqUser: User
    ): Promise<Partial<User> | null> {
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

            const updateData: Partial<User> = UserMapper.toPersistence({
                ...payload,
                passwordHash
            })

            try {
                await this.usersRepository.update(id, updateData)

                return UserMapper.toResponse({ id, ...user, ...updateData })
            } catch (error) {
                throw new Error(error)
            }
        } else {
            throw new ForbiddenException()
        }
    }

    async remove(id: string, reqUser: User) {
        const admin = isAdmin(reqUser.roles)

        if (admin || reqUser.id === id) {
            const user = await this.usersRepository.exists({
                where: { id }
            })

            if (!user) {
                throw new NotFoundException()
            }

            await this.usersRepository.softDelete(id)

            return null
        } else {
            throw new ForbiddenException()
        }
    }
}
