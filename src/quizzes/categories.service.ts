import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, TypeORMError } from 'typeorm'

import { CategoryEntity } from './entities/category.entity'
import { CategoryDto } from './dto/category.dto'

@Injectable()
export class CategoriesService {
    @InjectRepository(CategoryEntity)
    private readonly categoriesRepository: Repository<CategoryEntity>

    async create(payload: CategoryDto) {
        const category = this.categoriesRepository.create(payload)

        try {
            const newCategory = await this.categoriesRepository.save(category)

            return new CategoryEntity(newCategory)
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    async findOne(id: string) {
        const foundedCategory = await this.categoriesRepository.findOne({
            where: { id }
        })

        if (!foundedCategory) {
            throw new NotFoundException()
        }

        return new CategoryEntity(foundedCategory)
    }

    findAll() {
        return this.categoriesRepository.find()
    }

    async update(id: string, payload: CategoryDto) {
        const categoryChecked = await this.categoriesRepository.exists({
            where: { id }
        })

        if (!categoryChecked) {
            throw new NotFoundException()
        }

        const category = this.categoriesRepository.create(payload)

        return this.categoriesRepository.update({ id }, category)
    }

    async remove(id: string) {
        const categoryChecked = await this.categoriesRepository.exists({
            where: { id }
        })

        if (!categoryChecked) {
            throw new NotFoundException()
        }

        try {
            await this.categoriesRepository.delete(id)
        } catch (error) {
            if (error instanceof TypeORMError) throw new ConflictException()
        }

        return null
    }
}
