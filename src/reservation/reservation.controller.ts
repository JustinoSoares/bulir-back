import { Controller, Req, Query, Get, Post, Put, Delete, Param } from '@nestjs/common';
import { ReserUpdateDto } from './dto/reser-update.dto';
import { ReservationService } from './reservation.service';
import { ReserDto } from './dto/reser-create.dto';

@Controller('reservation')
export class ReservationController {
    constructor(private readonly reservationService: ReservationService) { }

    @Post('/create')
    async createReservation(@Req() req, data: ReserDto) {
        const userId = req.user.userId;
        return this.reservationService.createReservation(userId, data);
    }

    @Get('/all')
    async getReservationAll(@Req() req, @Query('page') page: string, @Query('limit') limit: string, @Query('name') name: string) {
        const userId = req.user.userId;
        return this.reservationService.getReservationAll(userId, page, limit, name);
    }

    @Get('/each/:reservationId')
    async getReservationEach(@Param('reservationId') reservationId: string) {
        return this.reservationService.getReservationEach(reservationId);
    }

    @Put('/update/:reservationId')
    async updateReservation(@Req() req, @Param('reservationId') reservationId: string, data: any) {
        const userId = req.user.userId;
        return this.reservationService.updateReservation(userId, reservationId, data);
    }

    @Delete('/delete/:reservationId')
    async deleteReservation(@Param('reservationId') reservationId: string) {
        return this.reservationService.deleteReservation(reservationId);
    }



}
