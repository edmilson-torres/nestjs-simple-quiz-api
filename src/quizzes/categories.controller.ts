import {
    UseGuards,
    UseInterceptors,
    ClassSerializerInterceptor,
    Controller
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'

import { CategoriesService } from './categories.service'

@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(ClassSerializerInterceptor)
@Controller('categories')
export class CategoriesController {
    constructor(private readonly quizzesService: CategoriesService) {}
}
