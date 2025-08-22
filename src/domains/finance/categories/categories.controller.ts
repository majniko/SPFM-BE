import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from '@identity/auth/auth.guard';
import { User } from '@identity/auth/decorators/user.decorator';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new category for the logged-in user' })
    @ApiResponse({ status: 201, description: 'The category has been successfully created.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    create(@Body() createCategoryDto: CreateCategoryDto, @User('sub') userId: string) {
        return this.categoriesService.create(createCategoryDto, userId);
    }

    @Get()
    @ApiOperation({ summary: 'Get all categories for the logged-in user' })
    @ApiResponse({ status: 200, description: 'Returns an array of user-defined categories.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    findAll(@User('sub') userId: string) {
        return this.categoriesService.findAll(userId);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a specific category' })
    @ApiResponse({ status: 200, description: 'The category has been successfully updated.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Category not found or does not belong to the user.' })
    update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @User('sub') userId: string) {
        return this.categoriesService.update(id, updateCategoryDto, userId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a specific category' })
    @ApiResponse({ status: 200, description: 'The category has been successfully deleted.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 404, description: 'Category not found or does not belong to the user.' })
    remove(@Param('id') id: string, @User('sub') userId: string) {
        return this.categoriesService.remove(id, userId);
    }
}