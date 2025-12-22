import { IsOptional, IsDate, IsEnum } from "class-validator";
import { reservation_status } from "@prisma/client";

export class ReserUpdateDto {

    @IsDate({
        message: 'A data da reserva deve ser uma data válida.',
    })
    @IsOptional()
    date: Date;

    @IsEnum(reservation_status, {
        message: `O status da reserva deve ser 'PENDING', 'CONFIRMED', ou 'CANCELLED'.`,
    })
    @IsOptional()
    status: reservation_status;
}