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
    ClassSerializerInterceptor,
    UseInterceptors,
    ParseUUIDPipe,
    UseGuards,
    SerializeOptions
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { QuizzesService } from './quizzes.service'
import { CreateQuizDto } from './dto/create-quiz.dto'
import { UpdateQuizDto } from './dto/update-quiz.dto'

import { AuthGuardJwt } from '../auth/guards/auth-jwt.guard'
import { CurrentUser } from '../users/decorators/user.decorator'
import { Roles } from '../auth/decorators/role.decorator'
import { RoleEnum } from '../users/entities/role.enum'
import { RoleGuard } from '../auth/guards/roles.guard'
import { IsActiveDto } from './dto/isActive.dto'
import { PassportUserDto } from '../auth/dto/passport-user.dto'

@ApiTags('Quizzes')
@ApiBearerAuth()
@UseGuards(AuthGuardJwt, RoleGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('quizzes')
export class QuizzesController {
    constructor(private readonly quizzesService: QuizzesService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@CurrentUser() user, @Body() createQuizDto: CreateQuizDto) {
        return this.quizzesService.create(user.id, createQuizDto)
    }

    @SerializeOptions({ groups: ['all'] })
    @Get()
    findAll() {
        return this.quizzesService.findAll()
    }

    @SerializeOptions({ groups: ['all'] })
    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.quizzesService.findOne(id)
    }

    @Patch(':id')
    update(
        @CurrentUser() user: PassportUserDto,
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateQuizDto: UpdateQuizDto
    ) {
        return this.quizzesService.update(id, updateQuizDto, user)
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser() user: PassportUserDto
    ) {
        return this.quizzesService.remove(id, user)
    }

    @Roles(RoleEnum.Admin, RoleEnum.Moderator)
    @Patch('/isactive/:id')
    isActive(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() isActive: IsActiveDto
    ) {
        return this.quizzesService.isActive(id, isActive)
    }
}
