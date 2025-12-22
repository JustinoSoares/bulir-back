import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { validate } from 'uuid';

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
        return this.prisma.service.create({ data: { ...data, userId } });
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
        const service = await this.prisma.service.findUnique({ where: { id: serviceId } });
        if (!service) {
            throw new BadRequestException('Serviço não encontrado.');
        }
        return service;
    }

    // Atualiza um serviço existente
    async updateService(serviceId: string, data: CreateServiceDto) {
        if (!validate(serviceId)) {
            throw new BadRequestException('ID de serviço inválido.');
        }
        const service = await this.prisma.service.findFirst({ where: { id: serviceId } });
        if (!service) {
            throw new BadRequestException('Serviço não encontrado.');
        }
        return this.prisma.service.update({
            where: { id: serviceId },
            data,
        });
    }

    // Obtém todos os serviços associados a um usuário específico
    async getServiceByUser(userId: string) {
        return this.prisma.service.findMany({ where: { userId } });
    }

    // Deleta um serviço existente
    async deleteService(serviceId: string) {
        if (!validate(serviceId)) {
            throw new BadRequestException('ID de serviço inválido.');
        }
        const service = await this.prisma.service.findFirst({ where: { id: serviceId } });
        if (!service) {
            throw new BadRequestException('Serviço não encontrado.');
        }
        await this.prisma.service.delete({ where: { id: serviceId } });
        return { message: 'Serviço deletado com sucesso.' };
    }
}
