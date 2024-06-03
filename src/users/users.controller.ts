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
    Request,
    ClassSerializerInterceptor,
    UseInterceptors
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'

import { UsersService } from './users.service'
import { Role } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@ApiTags('Users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOperation({ summary: 'create a new user' })
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto)
    }

    @ApiBearerAuth()
    @Roles(Role.Admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: 'list all users' })
    @Get()
    findAll() {
        return this.usersService.findAll()
    }

    @ApiBearerAuth()
    @Roles(Role.User, Role.Admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: 'get user by id' })
    @Get(':id')
    findOne(@Request() req, @Param('id', ParseUUIDPipe) id: string) {
        return this.usersService.findOne(id, req.user)
    }

    @ApiBearerAuth()
    @Roles(Role.User, Role.Admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: 'update a user by id' })
    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    update(
        @Request() req,
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateUserDto: UpdateUserDto
    ) {
        return this.usersService.update(id, updateUserDto, req.user)
    }

    @ApiBearerAuth()
    @Roles(Role.User, Role.Admin)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: 'delete a user by id' })
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Request() req, @Param('id', ParseUUIDPipe) id: string) {
        return this.usersService.remove(id, req.user)
    }
}
