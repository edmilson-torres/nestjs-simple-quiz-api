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
    Post
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'

import { AnswerService } from './answers.service'
import { AnswerDto } from './dto/answer.dto'
import { AuthGuardJwt } from '../auth/guards/auth-jwt.guard'
import { Roles } from '../auth/decorators/role.decorator'
import { RoleGuard } from '../auth/guards/roles.guard'
import { RoleEnum } from '../users/entities/role.enum'
import { CaslGuard } from '../casl/casl.guard'
import { Casl } from '../casl/casl.decorator'
import { Action } from '../casl/action.enum'
import { Subject } from '../casl/subject.enum'

@ApiTags('Answers')
@ApiBearerAuth()
@UseGuards(AuthGuardJwt, RoleGuard, CaslGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('answers')
export class AnswerController {
    constructor(private readonly answerService: AnswerService) {}

    @Casl([Action.Create, Subject.Answer])
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() payload: AnswerDto) {
        return this.answerService.create(payload)
    }

    @Casl([Action.List, Subject.Answer])
    @Roles(RoleEnum.Admin, RoleEnum.Moderator)
    @Get()
    findAll() {
        return this.answerService.findAll()
    }

    @Casl([Action.Read, Subject.Answer])
    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.answerService.findOne(id)
    }

    @Casl([Action.Update, Subject.Answer])
    @Patch(':id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() payload: AnswerDto) {
        return this.answerService.update(id, payload)
    }

    @Casl([Action.Delete, Subject.Answer])
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.answerService.remove(id)
    }
}
