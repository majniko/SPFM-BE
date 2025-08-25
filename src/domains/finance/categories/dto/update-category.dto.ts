import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiProperty({
    example: 'Food & Dining',
    description: 'The new name for the category',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
