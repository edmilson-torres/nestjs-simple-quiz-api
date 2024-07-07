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

import { CategoriesService } from './categories.service'
import { AuthGuardJwt } from '../../auth/guards/auth-jwt.guard'
import { RoleGuard } from '../../auth/guards/roles.guard'
import { CaslGuard } from '../../casl/casl.guard'
import { RoleEnum } from '../../users/entities/role.enum'
import { Subject } from '../../casl/subject.enum'
import { Action } from '../../casl/action.enum'
import { Roles } from '../../auth/decorators/role.decorator'
import { Casl } from '../../casl/casl.decorator'
import { CategoryDto } from './category.dto'

@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(AuthGuardJwt, RoleGuard, CaslGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Roles(RoleEnum.Admin, RoleEnum.Moderator)
    @Casl([Action.Create, Subject.Category])
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() payload: CategoryDto) {
        return this.categoriesService.create(payload)
    }

    @Casl([Action.List, Subject.Category])
    @Get()
    findAll() {
        return this.categoriesService.findAll()
    }

    @Casl([Action.Read, Subject.Category])
    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.categoriesService.findOne(id)
    }

    @Roles(RoleEnum.Admin, RoleEnum.Moderator)
    @Casl([Action.Update, Subject.Category])
    @Patch(':id')
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() payload: CategoryDto
    ) {
        return this.categoriesService.update(id, payload)
    }

    @Roles(RoleEnum.Admin, RoleEnum.Moderator)
    @Casl([Action.Delete, Subject.Category])
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.categoriesService.remove(id)
    }
}
