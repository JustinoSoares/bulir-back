import { Controller, Req, UseGuards, Get, Post, Query, HttpCode, Param, Put, Delete, Body } from '@nestjs/common';
import { ServiceService } from './service.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Controller('service')
export class ServiceController {
    constructor(private readonly serviceService: ServiceService) { }
    // Cria um novo serviço
    @Post('/create')
    @UseGuards(AuthGuard('jwt'))
    async createService(@Req() req,@Body() data: CreateServiceDto) {
        return this.serviceService.createService(req.user.userId, data);
    }
    // Obtém todos os serviços com paginação e filtro por nome
    @Get('/all')
    @HttpCode(200)
    async getAllServices(@Query('page') page: string, @Query('limit') limit: string, @Query("name") name: string) {
        return this.serviceService.getServiceAll(page, limit, name);
    }

    // Obtém um serviço específico pelo ID
    @Get('/each/:serviceId')
    @HttpCode(200)
    async getServiceEach(@Param('serviceId') serviceId: string) {
        return this.serviceService.getServiceEach(serviceId);
    }

    // Obtém todos os serviços de um usuário específico
    @Get('/by/user/:userId')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(200)
    async getMyServices(@Param('userId') userId: string) {
        return this.serviceService.getServiceByUser(userId);
    }

    // Atualiza um serviço existente
    @Put('/update/:serviceId')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(200)
    async updateService(@Param('serviceId') serviceId: string, @Req() req, @Body() data: UpdateServiceDto) {
        return this.serviceService.updateService(serviceId, req.user.userId, data);
    }

    // Deleta um serviço existente
    @Delete('/delete/:serviceId')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(200)
    async deleteService(@Param('serviceId') serviceId: string, @Req() req) {
        return this.serviceService.deleteService(serviceId, req.user.userId);
    }
}
