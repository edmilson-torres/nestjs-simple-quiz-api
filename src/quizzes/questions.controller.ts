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

import { Roles } from '../auth/decorators/role.decorator'
import { RoleEnum } from '../users/entities/role.enum'
import { RoleGuard } from '../auth/guards/roles.guard'
import { QuestionsService } from './questions.service'
import { CreateQuestionDto } from './dto/create-question.dto'
import { AuthGuardJwt } from '../auth/guards/auth-jwt.guard'
import { UpdateQuestionDto } from './dto/update-question.dto'

@ApiTags('Questions')
@ApiBearerAuth()
@UseGuards(AuthGuardJwt, RoleGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('questions')
export class QuestionsController {
    constructor(private readonly questionService: QuestionsService) {}

    @Roles(RoleEnum.Admin, RoleEnum.Moderator)
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() payload: CreateQuestionDto) {
        return this.questionService.create(payload)
    }

    @Get()
    findAll() {
        return this.questionService.findAll()
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.questionService.findOne(id)
    }

    @Roles(RoleEnum.Admin, RoleEnum.Moderator)
    @Patch(':id')
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() payload: UpdateQuestionDto
    ) {
        return this.questionService.update(id, payload)
    }

    @Roles(RoleEnum.Admin, RoleEnum.Moderator)
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.questionService.remove(id)
    }
}
