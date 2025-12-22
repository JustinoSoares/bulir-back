import { Controller, Get, Post, Body, Query, Param, Put, UseGuards, Req, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')

export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get("/each/:userId")
    async getUserEach(@Param('userId') userId: string) {
        return this.userService.getUserEach(userId);
    }

    @Get("/me")
    @UseGuards(AuthGuard('jwt'))
    async getUserMe(@Req() req) {
        return this.userService.getUserMe(req);
    }

    @Get("/all")
    async getAllUsers(@Query('page') page: string, @Query('limit') limit: string, @Query("name") name: string) {
        return this.userService.getUserAll(page, limit, name);
    }

    @Post("/create")
    async createUser(@Body() data: CreateUserDto) {
        return this.userService.createUser(data);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put("/update")
    async updateUser(@Req() req, @Body() data: UpdateUserDto) {
        return this.userService.updateUser(req.user.userId, data);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete("/delete")
    async deleteUser(@Req() req) {
        return this.userService.deleteUser(req.user.userId);
    }
}
