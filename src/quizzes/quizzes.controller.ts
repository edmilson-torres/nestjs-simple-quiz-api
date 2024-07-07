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
import { IsActiveDto } from './dto/isActive.dto'
import { PassportUserDto } from '../auth/dto/passport-user.dto'
import { RoleEnum } from '../users/entities/role.enum'

import { CurrentUser } from '../users/decorators/user.decorator'
import { AuthGuardJwt } from '../auth/guards/auth-jwt.guard'
import { RoleGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/role.decorator'
import { CaslGuard } from '../casl/casl.guard'
import { Casl } from '../casl/casl.decorator'
import { Action } from '../casl/action.enum'
import { Subject } from '../casl/subject.enum'

@ApiTags('Quizzes')
@ApiBearerAuth()
@UseGuards(AuthGuardJwt, RoleGuard, CaslGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('quizzes')
export class QuizzesController {
    constructor(private readonly quizzesService: QuizzesService) {}

    @Casl([Action.Create, Subject.Quiz])
    @Post()
    @SerializeOptions({ groups: ['all'] })
    @HttpCode(HttpStatus.CREATED)
    create(@CurrentUser() user, @Body() createQuizDto: CreateQuizDto) {
        return this.quizzesService.create(user.id, createQuizDto)
    }

    @Casl([Action.List, Subject.Quiz])
    @SerializeOptions({ groups: ['all'] })
    @Get()
    findAll() {
        return this.quizzesService.findAll()
    }

    @Casl([Action.Read, Subject.Quiz])
    @SerializeOptions({ groups: ['all'] })
    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.quizzesService.findOne(id)
    }

    @Casl([Action.Update, Subject.Quiz])
    @Patch(':id')
    update(
        @CurrentUser() user: PassportUserDto,
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateQuizDto: UpdateQuizDto
    ) {
        return this.quizzesService.update(id, updateQuizDto, user)
    }

    @Casl([Action.Delete, Subject.Quiz])
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser() user: PassportUserDto
    ) {
        return this.quizzesService.remove(id, user)
    }

    @Roles(RoleEnum.Admin, RoleEnum.Moderator)
    @Casl([Action.Update, Subject.Quiz])
    @Patch('/isactive/:id')
    isActive(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() isActive: IsActiveDto
    ) {
        return this.quizzesService.isActive(id, isActive)
    }
}
