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
    Request
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { Role } from 'src/auth/role.enum'
import { Roles } from 'src/auth/roles.decorator'

import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { RolesGuard } from 'src/auth/guards/roles.guard'

@ApiTags('Users')
@Controller('users')
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
