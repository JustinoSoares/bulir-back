import {    IsString, IsDate, IsEnum } from "class-validator";
import { reservation_status } from "@prisma/client";

export class ReserDto {
    @IsString({
        message: 'O ID do serviço deve ser uma string.',
    })
    serviceId: string;

    @IsDate({
        message: 'A data da reserva deve ser uma data válida.',
    })
    date: Date;

    @IsEnum(reservation_status, {
        message: `O status da reserva deve ser 'PENDING', 'CONFIRMED', ou 'CANCELLED'.`,
    })
    status: reservation_status;
}