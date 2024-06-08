import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpCode,
    HttpStatus,
    ParseUUIDPipe,
    UseGuards,
    ClassSerializerInterceptor,
    UseInterceptors
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'

import { UsersService } from './users.service'
import { Role } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { AuthGuard } from '@nestjs/passport'
import { GetCurrentUser } from './decorators/user.decorator'
import { PassportUser } from './types/passport-user.type'

@ApiTags('Users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOperation({ summary: 'create a new user' })
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() payload: CreateUserDto) {
        return this.usersService.create(payload)
    }

    @ApiBearerAuth()
    @Roles(Role.Admin)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiOperation({ summary: 'list all users' })
    @Get()
    findAll() {
        return this.usersService.findAll()
    }

    @ApiBearerAuth()
    @Roles(Role.User, Role.Admin)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiOperation({ summary: 'get user by id' })
    @Get(':id')
    findOne(
        @GetCurrentUser() user: PassportUser,
        @Param('id', ParseUUIDPipe) id: string
    ) {
        return this.usersService.findOne(id, user)
    }

    @ApiBearerAuth()
    @Roles(Role.User, Role.Admin)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiOperation({ summary: 'update a user by id' })
    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    update(
        @GetCurrentUser() user: PassportUser,
        @Param('id', ParseUUIDPipe) id: string,
        @Body() payload: UpdateUserDto
    ) {
        return this.usersService.update(id, payload, user)
    }

    @ApiBearerAuth()
    @Roles(Role.User, Role.Admin)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @ApiOperation({ summary: 'delete a user by id' })
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(
        @GetCurrentUser() user: PassportUser,
        @Param('id', ParseUUIDPipe) id: string
    ) {
        return this.usersService.remove(id, user)
    }
}
