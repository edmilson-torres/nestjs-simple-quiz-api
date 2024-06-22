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
    UseGuards
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { QuizzesService } from './quizzes.service'
import { CreateQuizDto } from './dto/create-quiz.dto'
import { UpdateQuizDto } from './dto/update-quiz.dto'

import { AuthGuardJwt } from '../auth/guards/auth-jwt.guard'
import { CurrentUser } from '../users/decorators/user.decorator'
import { Roles } from '../auth/decorators/roles.decorator'
import { RolesEnum } from '../users/entities/user.entity'
import { RolesGuard } from '../auth/guards/roles.guard'

@ApiTags('Quizzes')
@ApiBearerAuth()
@UseGuards(AuthGuardJwt, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('quizzes')
export class QuizzesController {
    constructor(private readonly quizzesService: QuizzesService) {}

    @Roles(RolesEnum.User, RolesEnum.Admin, RolesEnum.Moderator)
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@CurrentUser() user, @Body() createQuizDto: CreateQuizDto) {
        return this.quizzesService.create(user.id, createQuizDto)
    }

    @Get()
    findAll() {
        return this.quizzesService.findAll()
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.quizzesService.findOne(id)
    }

    @Patch(':id')
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateQuizDto: UpdateQuizDto
    ) {
        return this.quizzesService.update(id, updateQuizDto)
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.quizzesService.remove(id)
    }
}
