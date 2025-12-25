import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { validate } from 'uuid';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServiceService {
    constructor(private readonly prisma: PrismaService) {}

    // Cria um novo serviço associado a um usuário
    async createService(userId: string, data: CreateServiceDto) {
        const userExist = await this.prisma.user.findFirst({ where: { id: userId } });
        if (!userExist) {
            throw new BadRequestException('Usuário não encontrado.');
        }
        if (userExist.user_type !== 'servicer') {
            throw new UnauthorizedException('Este Usuário não é um prestador de serviços.');
        }
        const existService = await this.prisma.service.findFirst({ 
            where: { name: data.name, userId: userId } 
        });
        if (existService) {
            throw new BadRequestException('Você já possui um serviço com este nome.');
        }

        const service = await this.prisma.service.create({ 
            data: { 
                ...data,
                userId: userId
            } 
        });
        return service;
    }

    // Obtém todos os serviços com paginação e filtro por nome
    async getServiceAll(page: string, limit: string, name: string) {
        const newPage = parseInt(page) || 1; // página padrão 1
        const newLimit = parseInt(limit) || 10; // limite padrão 10
        const skip = (newPage - 1) * newLimit; // cálculo do offset
        return this.prisma.service.findMany({
            skip,
            take: newLimit,
            where: name ? {
                name: {
                    contains: name,
                    mode: 'insensitive',
                },
            } : {},
        });
    }

    // Obtém um serviço específico pelo ID
    async getServiceEach(serviceId: string) {
        if (!validate(serviceId)) {
            throw new BadRequestException('ID de serviço inválido.');
        }
        const service = await this.prisma.service.findFirst({ 
            where: { id: serviceId } 
        });
        if (!service) {
            throw new BadRequestException('Serviço não encontrado.');
        }
        return service;
    }

    // Atualiza um serviço existente
    async updateService(serviceId: string, userId: string, data: UpdateServiceDto) {
        if (!validate(serviceId)) {
            throw new BadRequestException('ID de serviço inválido.');
        }
        const service = await this.prisma.service.findFirst({ where: { id: serviceId } });
        if (!service) {
            throw new BadRequestException('Serviço não encontrado.');
        }

        if (service.userId !== userId)
            throw new UnauthorizedException('Você não tem permissão para atualizar este serviço.');
        return this.prisma.service.update({
            where: { id: serviceId },
            data:{
                name : data.name || service.name,
                description : data.description || service.description,
                price : data.price !== undefined ? data.price : service.price,
            }
        });
    }

    // Obtém todos os serviços associados a um usuário específico
    async getServiceByUser(userId: string) {
        return this.prisma.service.findMany({ where: { userId } });
    }

    // Deleta um serviço existente
    async deleteService(serviceId: string, userId: string) {
        if (!validate(serviceId)) {
            throw new BadRequestException('ID de serviço inválido.');
        }
        const service = await this.prisma.service.findFirst({ where: { id: serviceId } });
        if (!service) {
            throw new BadRequestException('Serviço não encontrado.');
        }

        if (service.userId !== userId)
            throw new UnauthorizedException('Você não tem permissão para deletar este serviço.');

        await this.prisma.reservation.deleteMany({ where: { serviceId } });
        
        await this.prisma.service.delete({ where: { id: serviceId } });
        return { message: 'Serviço deletado com sucesso.' };
    }
}
