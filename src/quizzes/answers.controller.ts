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

import { Roles } from '../auth/decorators/roles.decorator'
import { RolesEnum } from '../users/entities/roles.enum'
import { RolesGuard } from '../auth/guards/roles.guard'
import { AnswerDto } from './dto/answer.dto'
import { AnswerService } from './answers.service'
import { AuthGuardJwt } from '../auth/guards/auth-jwt.guard'

@ApiTags('Answers')
@ApiBearerAuth()
@UseGuards(AuthGuardJwt, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('answers')
export class AnswerController {
    constructor(private readonly answerService: AnswerService) {}

    @Roles(RolesEnum.Admin, RolesEnum.Moderator)
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() payload: AnswerDto) {
        return this.answerService.create(payload)
    }

    @Get()
    findAll() {
        return this.answerService.findAll()
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.answerService.findOne(id)
    }

    @Roles(RolesEnum.Admin, RolesEnum.Moderator)
    @Patch(':id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() payload: AnswerDto) {
        return this.answerService.update(id, payload)
    }

    @Roles(RolesEnum.Admin, RolesEnum.Moderator)
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.answerService.remove(id)
    }
}
