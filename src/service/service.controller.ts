import { Controller, Req, UseGuards, Get, Post, Query, HttpCode, Param, Put, Delete } from '@nestjs/common';
import { ServiceService } from './service.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateServiceDto } from './dto/create-service.dto';

@Controller('service')
export class ServiceController {
    constructor(private readonly serviceService: ServiceService) { }

    @Post('/create')
    @UseGuards(AuthGuard('jwt'))
    async createService(@Req() req, data: CreateServiceDto) {
        return this.serviceService.createService(req.user.userId, data);
    }

    @Get('/all')
    @HttpCode(200)
    async getAllServices(@Query('page') page: string, @Query('limit') limit: string, @Query("name") name: string) {
        return this.serviceService.getServiceAll(page, limit, name);
    }

    @Get('/each/:serviceId')
    @HttpCode(200)
    async getServiceEach(@Query('serviceId') serviceId: string) {
        return this.serviceService.getServiceEach(serviceId);
    }

    @Get('/by/user/:userId')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(200)
    async getMyServices(@Param('userId') userId: string) {
        return this.serviceService.getServiceByUser(userId);
    }

    @Put('/update/:serviceId')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(200)
    async updateService(@Param('serviceId') serviceId: string, data: CreateServiceDto) {
        return this.serviceService.updateService(serviceId, data);
    }

    @Delete('/delete/:serviceId')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(200)
    async deleteService(@Param('serviceId') serviceId: string) {
        return this.serviceService.deleteService(serviceId);
    }
}
