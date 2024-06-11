import { Test, TestingModule } from '@nestjs/testing'
import { CreateUserDto } from './dto/create-user.dto'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { PassportUser } from './types/passport-user.type'
import { Role } from './entities/user.entity'

const createUserDto: CreateUserDto = {
    firstName: 'firstName #1',
    lastName: 'lastName #1',
    email: 'teste@test.com',
    password: 'Test.123456'
}

const req: PassportUser = {
    id: '1',
    email: 'teste@test.com',
    roles: [Role.User]
}

describe('UsersController', () => {
    let usersController: UsersController
    let usersService: UsersService

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                UsersService,
                {
                    provide: UsersService,
                    useValue: {
                        create: jest
                            .fn()
                            .mockImplementation((user: CreateUserDto) =>
                                Promise.resolve({ id: '1', ...user })
                            ),
                        findAll: jest.fn().mockResolvedValue([
                            {
                                firstName: 'firstName #1',
                                lastName: 'lastName #1'
                            },
                            {
                                firstName: 'firstName #2',
                                lastName: 'lastName #2'
                            }
                        ]),
                        findOne: jest.fn().mockImplementation((id: string) =>
                            Promise.resolve({
                                firstName: 'firstName #1',
                                lastName: 'lastName #1',
                                id
                            })
                        ),
                        remove: jest.fn()
                    }
                }
            ]
        }).compile()

        usersController = app.get<UsersController>(UsersController)
        usersService = app.get<UsersService>(UsersService)
    })

    it('should be defined', () => {
        expect(usersController).toBeDefined()
    })

    describe('create()', () => {
        it('should create a user', () => {
            usersController.create(createUserDto)
            expect(usersController.create(createUserDto)).resolves.toEqual({
                id: '1',
                ...createUserDto
            })
            expect(usersService.create).toHaveBeenCalledWith(createUserDto)
        })
    })

    describe('findAll()', () => {
        it('should find all users ', () => {
            usersController.findAll()
            expect(usersService.findAll).toHaveBeenCalled()
        })
    })

    describe('findOne()', () => {
        it('should find a user', () => {
            expect(usersController.findOne(req, '1')).resolves.toEqual({
                firstName: 'firstName #1',
                lastName: 'lastName #1',
                id: '1'
            })
            expect(usersService.findOne).toHaveBeenCalled()
        })
    })

    describe('remove()', () => {
        it('should remove the user', () => {
            usersController.remove(req, '2')
            expect(usersService.remove).toHaveBeenCalled()
        })
    })
})
