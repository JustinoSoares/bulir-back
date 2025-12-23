import { IsString, IsDate, IsEnum, IsOptional } from "class-validator";
import { reservation_status } from "@prisma/client";

export class ReserDto {
    @IsString({
        message: 'O ID do serviço deve ser uma string.',
    })
    serviceId: string;

    @IsString({
        message: 'A data da reserva deve ser uma data válida.',
    })
    date: string;

    @IsEnum(reservation_status, {
        message: `O status da reserva deve ser 'pending', 'confirmed', ou 'cancelled'.`,
    })
    @IsOptional()
    status: reservation_status;
}