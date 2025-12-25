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

        const existUser = await this.prisma.user.findFirst({ where: { id: userId } });
        if (!existUser) {
            throw new BadRequestException('Usuário não encontrado.');
        }
        if (existUser.user_type === 'servicer') {
            throw new BadRequestException('Prestadores de serviço não podem criar reservas.');
        }
        // verificar se date esta no formato de uma data válida
        if (isNaN(new Date(date).getTime())) {
            throw new BadRequestException('A data da reserva deve ser uma data válida.');
        }
        // validar a data não estar no passado
        const now = new Date();
        if (new Date(date) < now) {
            throw new BadRequestException('A data da reserva não pode ser no passado.');
        }

        const existReservation = await this.prisma.reservation.findFirst({
            where: {
                serviceId,
                date: new Date(date),
                userId
            },
        });
        if (existReservation) {
            throw new BadRequestException('Já existe uma reserva para este serviço nesta data.');
        }


        const serviceExist = await this.prisma.service.findFirst({ where: { id: serviceId } });
        if (!serviceExist) {
            throw new BadRequestException('Serviço não encontrado.');
        }

        if (existUser.balance < serviceExist.price) {
            throw new BadRequestException('Saldo insuficiente para criar a reserva.');
        }

        // Deduzir o valor do serviço do saldo do usuário
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                balance: {
                    decrement: serviceExist.price,
                },
            },
        });

        // Aumentar o saldo do prestador de serviço
        await this.prisma.user.update({
            where: { id: serviceExist.userId },
            data: {
                balance: {
                    increment: serviceExist.price,
                },
            },
        });

        return this.prisma.reservation.create({
            data: {
                userId,
                serviceId,
                date: new Date(date),
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

        //if (existUser.user_type === 'servicer') {
        //  throw new BadRequestException('Prestadores de serviço não podem ter reservas.');
        //}

        // definir a cláusula where com base no tipo de usuário
        if (existUser.user_type === 'client') {
            whereClause.userId = userId;
        }
        else {
            whereClause.service = {
                userId: userId,
            };
        }
        if (name) {
            whereClause.service = {
                name: {
                    contains: name,
                    mode: 'insensitive', // case-insensitive search, para evitar problemas com maiúsculas/minúsculas
                },
            };
        }
        const reservations = await this.prisma.reservation.findMany({
            where: whereClause,
            include: {
                service: true,
            },
            skip: skip,
            take: newLimit,
            orderBy: {
                createdAt: 'desc',
            },
        });
        return reservations;
    }

    // pegar uma reserva específica
    async getReservationEach(userId: string, reservationId: string) {
        if (!validate(reservationId)) {
            throw new BadRequestException('ID de reserva inválido.');
        }
        const existUser = await this.prisma.user.findFirst({ where: { id: userId } });
        if (!existUser) {
            throw new BadRequestException('Usuário não encontrado.');
        }

        if (existUser.user_type === 'client') {
            const reservation = await this.prisma.reservation.findFirst({
                where: { id: reservationId },
                include: {
                    service: true,
                },
            });

            if (!reservation) {
                throw new BadRequestException('Reserva não encontrada.');
            }
            if (reservation.userId !== userId) {
                throw new BadRequestException('Acesso negado à reserva.');
            }
            return reservation;
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

        if (reservation.service.userId !== userId) {
            throw new BadRequestException('Acesso negado à reserva.');
        }
        return reservation;
    }

    // atualizar uma reserva
    async updateReservation(userId: string, reservationId: string, data: ReserUpdateDto) {

        const { date, status } = data;

        if (!validate(reservationId)) {
            throw new BadRequestException('ID de reserva inválido.');
        }
        const reservation = await this.prisma.reservation.findFirst({
            where: { id: reservationId },
        });

        if (!reservation) {
            throw new BadRequestException('Reserva não encontrada.');
        }

        if (reservation.status === 'cancelled') {
            throw new BadRequestException('Não é possível atualizar uma reserva cancelada.');
        }

        if (reservation.status === "completed") {
            throw new BadRequestException('Não é possível atualizar uma reserva concluída.');
        }

        const now = new Date();
        if (date && date < now) {
            throw new BadRequestException('A data da reserva não pode ser no passado.');
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
