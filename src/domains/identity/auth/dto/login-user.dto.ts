import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
    @ApiProperty({
        example: 'testuser',
        description: 'The username of the user',
    })
    @IsString()
    username: string;

    @ApiProperty({
        example: 'password123',
        description: 'The password for the user account (must be at least 8 characters)',
    })
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    password: string;
}