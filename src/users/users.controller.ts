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
    UseInterceptors,
    SerializeOptions
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { CurrentUser } from './decorators/user.decorator'
import { UsersService } from './users.service'
import { RolesEnum } from './entities/roles.enum'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { Public } from '../auth/decorators/public.decorator'
import { AuthGuardJwt } from '../auth/guards/auth-jwt.guard'
import { PassportUserDto } from '../auth/dto/passport-user.dto'

@ApiTags('Users')
@UseGuards(AuthGuardJwt, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOperation({ summary: 'create a new user' })
    @Public()
    @SerializeOptions({ groups: ['self', 'all'] })
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() payload: CreateUserDto) {
        return this.usersService.create(payload)
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'list all users' })
    @Roles(RolesEnum.Admin)
    @SerializeOptions({ groups: ['self', 'all'] })
    @Get()
    findAll() {
        return this.usersService.findAll()
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'get user by id' })
    @Roles(RolesEnum.User, RolesEnum.Admin)
    @SerializeOptions({ groups: ['self', 'all'] })
    @Get(':id')
    findOne(
        @CurrentUser() user: PassportUserDto,
        @Param('id', ParseUUIDPipe) id: string
    ) {
        return this.usersService.findOne(id, user)
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'update a user by id' })
    @Roles(RolesEnum.User, RolesEnum.Admin)
    @SerializeOptions({ groups: ['self', 'all'] })
    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    update(
        @CurrentUser() user: PassportUserDto,
        @Param('id', ParseUUIDPipe) id: string,
        @Body() payload: UpdateUserDto
    ) {
        return this.usersService.update(id, payload, user)
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'delete a user by id' })
    @Roles(RolesEnum.User, RolesEnum.Admin)
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(
        @CurrentUser() user: PassportUserDto,
        @Param('id', ParseUUIDPipe) id: string
    ) {
        return this.usersService.remove(id, user)
    }
}
