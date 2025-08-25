import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Groceries',
    description: 'The name of the category',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
