import {
    UseGuards,
    UseInterceptors,
    ClassSerializerInterceptor,
    Controller,
    Body,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    SerializeOptions
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'

import { QuestionsService } from './questions.service'
import { CreateQuestionDto } from './dto/create-question.dto'
import { UpdateQuestionDto } from './dto/update-question.dto'
import { RoleGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/role.decorator'
import { RoleEnum } from '../users/entities/role.enum'
import { AuthGuardJwt } from '../auth/guards/auth-jwt.guard'
import { CaslGuard } from '../casl/casl.guard'
import { Casl } from '../casl/casl.decorator'
import { Action } from '../casl/action.enum'
import { Subject } from '../casl/subject.enum'
import { PassportUserDto } from '../auth/dto/passport-user.dto'
import { CurrentUser } from '../users/decorators/user.decorator'

@ApiTags('Questions')
@ApiBearerAuth()
@UseGuards(AuthGuardJwt, RoleGuard, CaslGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('questions')
export class QuestionsController {
    constructor(private readonly questionService: QuestionsService) {}

    @Casl([Action.Create, Subject.Question])
    @Post()
    @SerializeOptions({ groups: ['all'] })
    @HttpCode(HttpStatus.CREATED)
    create(
        @CurrentUser() user: PassportUserDto,
        @Body() payload: CreateQuestionDto
    ) {
        return this.questionService.create(payload, user)
    }

    @Roles(RoleEnum.Admin, RoleEnum.Moderator)
    @Casl([Action.List, Subject.Question])
    @Get()
    findAll() {
        return this.questionService.findAll()
    }

    @Casl([Action.Read, Subject.Question])
    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.questionService.findOne(id)
    }

    @Casl([Action.Update, Subject.Question])
    @SerializeOptions({ groups: ['all'] })
    @Patch(':id')
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() payload: UpdateQuestionDto
    ) {
        return this.questionService.update(id, payload)
    }

    @Casl([Action.Delete, Subject.Question])
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.questionService.remove(id)
    }
}
