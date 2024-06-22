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
import { QuestionsService } from './questions.service'
import { QuestionDto } from './dto/question.dto'
import { AuthGuardJwt } from '../auth/guards/auth-jwt.guard'

@ApiTags('Questions')
@ApiBearerAuth()
@UseGuards(AuthGuardJwt, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('questions')
export class QuestionsController {
    constructor(private readonly questionService: QuestionsService) {}

    @Roles(RolesEnum.Admin, RolesEnum.Moderator)
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() payload: QuestionDto) {
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

    @Roles(RolesEnum.Admin, RolesEnum.Moderator)
    @Patch(':id')
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() payload: QuestionDto
    ) {
        return this.questionService.update(id, payload)
    }

    @Roles(RolesEnum.Admin, RolesEnum.Moderator)
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.questionService.remove(id)
    }
}
