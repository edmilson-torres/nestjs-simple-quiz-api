import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Role, UserEntity } from './entities/user.entity'
import { UsersService } from './users.service'
import { HashModule } from '../shared/hash/hash.module'

const userArray = [
    {
        firstName: 'firstName #1',
        lastName: 'lastName #1',
        email: 'teste@teste1.com',
        roles: ['user']
    },
    {
        firstName: 'firstName #2',
        lastName: 'lastName #2',
        email: 'teste@teste2.com',
        roles: ['user']
    }
]

const oneUser = {
    firstName: 'firstName #1',
    lastName: 'lastName #1',
    email: 'teste@teste.com',
    roles: ['user']
}

const req = { id: '1', email: 'teste@test.com', roles: [Role.User] }

describe('UserService', () => {
    let service: UsersService
    let repository: Repository<UserEntity>

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [HashModule],
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(UserEntity),
                    useValue: {
                        save: jest.fn().mockResolvedValue(oneUser),
                        create: jest.fn(),
                        findAll: jest.fn().mockResolvedValue(userArray),
                        find: jest.fn().mockResolvedValue(userArray),
                        findOne: jest.fn().mockResolvedValue(oneUser),
                        findOneByEmail: jest.fn(),
                        update: jest.fn(),
                        remove: jest.fn(),
                        exists: jest.fn(),
                        softDelete: jest.fn()
                    }
                }
            ]
        }).compile()

        service = module.get<UsersService>(UsersService)
        repository = module.get<Repository<UserEntity>>(
            getRepositoryToken(UserEntity)
        )
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('create()', () => {
        it('should successfully insert a user', () => {
            jest.spyOn(repository, 'findOne').mockReturnValue(null)

            expect(
                service.create({
                    firstName: 'firstName #1',
                    lastName: 'lastName #1',
                    email: 'teste@teste.com',
                    password: '123456',
                    roles: [Role.Admin]
                })
            ).resolves.toEqual({
                firstName: 'firstName #1',
                lastName: 'lastName #1',
                email: 'teste@teste.com',
                roles: [Role.User]
            })
        })
    })

    describe('findAll()', () => {
        it('should return an array of users', async () => {
            const users = await service.findAll()
            expect(users).toEqual(userArray)
        })
    })

    describe('findOne()', () => {
        it('should get a single user', () => {
            expect(service.findOne('1', req)).resolves.toEqual(oneUser)
        })
    })

    describe('remove()', () => {
        it('should call remove with the passed value', async () => {
            jest.spyOn(repository, 'exists').mockReturnValue(
                Promise.resolve(true)
            )
            const result = await service.remove('1', req)
            expect(result).toBeFalsy()
        })
    })
})
