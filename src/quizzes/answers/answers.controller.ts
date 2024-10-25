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

import { AnswerService } from '../answers/answers.service'
import { CreateAnswerDto } from './answer.dto'
import { AuthGuardJwt } from '../../auth/guards/auth-jwt.guard'
import { Roles } from '../../auth/decorators/role.decorator'
import { RoleGuard } from '../../auth/guards/roles.guard'
import { RoleEnum } from '../../users/entities/role.enum'
import { CaslGuard } from '../../casl/casl.guard'
import { Casl } from '../../casl/casl.decorator'
import { Action } from '../../casl/action.enum'
import { Subject } from '../../casl/subject.enum'
import { PassportUserDto } from '../../auth/dto/passport-user.dto'
import { CurrentUser } from '../../users/decorators/user.decorator'

@ApiTags('Answers')
@ApiBearerAuth()
@UseGuards(AuthGuardJwt, RoleGuard, CaslGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('answers')
export class AnswerController {
    constructor(private readonly answerService: AnswerService) {}

    @Casl([Action.Create, Subject.Answer])
    @SerializeOptions({ groups: ['all'] })
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(
        @CurrentUser() user: PassportUserDto,
        @Body() payload: CreateAnswerDto
    ) {
        return this.answerService.create(payload, user)
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
    @SerializeOptions({ groups: ['all'] })
    @Patch(':id')
    update(
        @CurrentUser() user: PassportUserDto,
        @Param('id', ParseUUIDPipe) id: string,
        @Body() payload: CreateAnswerDto
    ) {
        return this.answerService.update(id, payload, user)
    }

    @Casl([Action.Delete, Subject.Answer])
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.answerService.remove(id)
    }
}
