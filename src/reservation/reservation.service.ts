import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { validate } from 'uuid';
import { ReserDto } from './dto/reser-create.dto';
import { ReserUpdateDto } from './dto/reser-update.dto';

@Injectable()
export class ReservationService {
    constructor(private prisma: PrismaService) { }

    // criar reserva
    async createReservation(userId: string, data: ReserDto) {
        const { serviceId, date } = data;
        if (!validate(userId) || !validate(serviceId)) {
            throw new BadRequestException('IDs inválidos.');
        }

        // validar a data não estar no passado
        const now = new Date();
        if (date < now) {
            throw new BadRequestException('A data da reserva não pode ser no passado.');
        }
        return this.prisma.reservation.create({
            data: {
                userId,
                serviceId,
                date,
            },
        });
    }
    // pegar as minhas reservas
    async getReservationAll(userId: string, page: string, limit: string, name: string) {
        const newPage = parseInt(page) || 1; // página padrão 1
        const newLimit = parseInt(limit) || 10; // limite padrão 10
        const skip = (newPage - 1) * newLimit; // cálculo do offset

        const whereClause: any = {};
        if (!validate(userId)) {
            throw new BadRequestException('ID de usuário inválido.');
        }

        const existUser = await this.prisma.user.findFirst({ where: { id: userId } });
        if (!existUser) {
            throw new BadRequestException('Usuário não encontrado.');
        }

        if (existUser.user_type === 'servicer') {
            throw new BadRequestException('Prestadores de serviço não podem ter reservas.');
        }
        whereClause.userId = userId;

        if (name) {
            whereClause.service = {
                name: {
                    contains: name,
                    mode: 'insensitive',
                },
            };
        }

        return this.prisma.reservation.findMany({
            skip,
            take: newLimit,
            where: whereClause,
            include: {
                service: true,
            },
        });
    }

    // pegar uma reserva específica
    async getReservationEach(reservationId: string) {
        if (!validate(reservationId)) {
            throw new BadRequestException('ID de reserva inválido.');
        }
        const reservation = await this.prisma.reservation.findFirst({
            where: { id: reservationId },
            include: {
                service: true,
            },
        });
        if (!reservation) {
            throw new BadRequestException('Reserva não encontrada.');
        }
        return reservation;

    }

    // atualizar uma reserva
    async updateReservation(userId: string, reservationId: string,  data: ReserUpdateDto) {

        const { date, status } = data;

        if (!validate(reservationId)) {
            throw new BadRequestException('ID de reserva inválido.');
        }
        const reservation = await this.prisma.reservation.findFirst({
            where: { id: reservationId },
        });

        const now = new Date();
        if (date && date < now) {
            throw new BadRequestException('A data da reserva não pode ser no passado.');
        }

        if (!reservation) {
            throw new BadRequestException('Reserva não encontrada.');
        }
        return this.prisma.reservation.update({
            where: { id: reservationId },
            data: {
                date: date || reservation.date,
                status: status || reservation.status,
            },
        });
    }

    // deletar uma reserva
    async deleteReservation(reservationId: string) {
        if (!validate(reservationId)) {
            throw new BadRequestException('ID de reserva inválido.');
        }
        const reservation = await this.prisma.reservation.findFirst({
            where: { id: reservationId },
        });
        if (!reservation) {
            throw new BadRequestException('Reserva não encontrada.');
        }
        return this.prisma.reservation.delete({
            where: { id: reservationId },
        });
    }
}
