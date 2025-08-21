import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('register')
    create(@Body() createUserDto: CreateUserDto) {
        // We can add input validation here using Pipes, which is the "NestJS way"
        // For now, we'll pass it directly to the service.
        return this.usersService.create(createUserDto);
    }
}