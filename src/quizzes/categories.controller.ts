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
import { AuthGuard } from '@nestjs/passport'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'

import { CategoriesService } from './categories.service'
import { CategoryDto } from './dto/category.dto'
import { Roles } from '../auth/decorators/roles.decorator'
import { RolesEnum } from '../users/entities/user.entity'
import { RolesGuard } from '../auth/guards/roles.guard'

@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Roles(RolesEnum.Admin, RolesEnum.Moderator)
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() payload: CategoryDto) {
        return this.categoriesService.create(payload)
    }

    @Get()
    findAll() {
        return this.categoriesService.findAll()
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.categoriesService.findOne(id)
    }

    @Roles(RolesEnum.Admin, RolesEnum.Moderator)
    @Patch(':id')
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() payload: CategoryDto
    ) {
        return this.categoriesService.update(id, payload)
    }

    @Roles(RolesEnum.Admin, RolesEnum.Moderator)
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.categoriesService.remove(id)
    }
}
