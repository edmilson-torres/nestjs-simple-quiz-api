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
import { Role, UserEntity } from './entities/user.entity'
import { UserMapper } from './users.mapper'
import { HashService } from '../shared/hash/hash.service'
import { isAdmin } from '../shared/isAdmin'

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly usersRepository: Repository<UserEntity>,
        private readonly hashing: HashService
    ) {}

    async create(payload: CreateUserDto): Promise<Partial<UserEntity>> {
        const userObject = await this.usersRepository.findOne({
            where: { email: payload.email }
        })
        if (userObject) {
            throw new BadRequestException('Invalid data')
        }

        const passwordHash = await this.hashing.hash(payload.password)

        payload.roles = [Role.User]

        const createData: Partial<UserEntity> = UserMapper.toPersistence({
            passwordHash,
            ...payload
        })

        try {
            const newUser = await this.usersRepository.save(createData)

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

            const updateData: Partial<UserEntity> = UserMapper.toPersistence({
                ...payload,
                passwordHash
            })

            try {
                await this.usersRepository.update(id, updateData)

                const response = new UserEntity({ id, ...user, ...updateData })

                return response
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

            await this.usersRepository.softDelete(id)

            return null
        } else {
            throw new ForbiddenException()
        }
    }
}
