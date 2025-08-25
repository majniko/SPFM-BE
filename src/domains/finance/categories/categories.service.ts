import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@core/prisma';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto, userId: string) {
    const { name } = createCategoryDto;

    const existingCategory = await this.prisma.categories.findFirst({
      where: {
        name,
        userId,
      },
    });

    if (existingCategory) {
      throw new ConflictException('category_exists');
    }

    try {
      await this.prisma.categories.create({
        data: {
          name,
          userId,
        },
      });
      return { message: 'category_created' };
    } catch (e) {
      throw new InternalServerErrorException('unexpected_prisma_error');
    }
  }

  findAll(userId: string) {
    return this.prisma.categories.findMany({
      where: {
        userId,
      },
    });
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    userId: string,
  ) {
    const { name } = updateCategoryDto;

    const existingCategory = await this.prisma.categories.findFirst({
      where: {
        name,
        userId,
        id: { not: id },
      },
    });

    if (existingCategory) {
      throw new ConflictException('category_exists');
    }

    try {
      await this.prisma.categories.update({
        where: {
          id,
          userId,
        },
        data: {
          name,
        },
      });
      return { message: 'category_updated' };
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new NotFoundException('category_not_found');
      }
      throw new InternalServerErrorException('unexpected_prisma_error');
    }
  }

  async remove(id: string, userId: string) {
    try {
      await this.prisma.categories.delete({
        where: {
          id,
          userId,
        },
      });
      return { message: 'category_deleted' };
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new NotFoundException('category_not_found');
      }
      throw new InternalServerErrorException('unexpected_prisma_error');
    }
  }
}
