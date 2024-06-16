import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CategoryEntity } from './entities/category.entity'

@Injectable()
export class CategoriesService {
    @InjectRepository(CategoryEntity)
    private readonly categoriesRepository: Repository<CategoryEntity>
}
