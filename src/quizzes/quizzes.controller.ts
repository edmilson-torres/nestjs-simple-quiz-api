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
import { AuthGuard } from '@nestjs/passport'

@ApiTags('Quizzes')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(ClassSerializerInterceptor)
@Controller('quizzes')
export class QuizzesController {
    constructor(private readonly quizzesService: QuizzesService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createQuizDto: CreateQuizDto) {
        return this.quizzesService.create(createQuizDto)
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
