import { Controller, Req, Query, Get, Post, Put, Delete, Param, UseGuards, Body } from '@nestjs/common';
import { ReserUpdateDto } from './dto/reser-update.dto';
import { ReservationService } from './reservation.service';
import { ReserDto } from './dto/reser-create.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('reservation')
export class ReservationController {
    constructor(private readonly reservationService: ReservationService) { }

    @Post('/create')
    @UseGuards(AuthGuard('jwt'))
    async createReservation(@Req() req, @Body() data: ReserDto) {
        const userId = req.user.userId;
        return this.reservationService.createReservation(userId, data);
    }

    @Get('/all')
    @UseGuards(AuthGuard('jwt'))
    async getReservationAll(@Req() req, @Query('page') page: string, @Query('limit') limit: string, @Query('name') name: string) {
        const userId = req.user.userId;
        return this.reservationService.getReservationAll(userId, page, limit, name);
    }

    @Get('/each/:reservationId')
    @UseGuards(AuthGuard('jwt'))
    async getReservationEach(@Req() req, @Param('reservationId') reservationId: string) {
        const userId = req.user.userId;
        return this.reservationService.getReservationEach(userId, reservationId);
    }

    @Put('/update/:reservationId')
    @UseGuards(AuthGuard('jwt'))
    async updateReservation(@Req() req, @Param('reservationId') reservationId: string, @Body() data: any) {
        const userId = req.user.userId;
        return this.reservationService.updateReservation(userId, reservationId, data);
    }

    @Delete('/delete/:reservationId')
    @UseGuards(AuthGuard('jwt'))
    async deleteReservation(@Param('reservationId') reservationId: string) {
        return this.reservationService.deleteReservation(reservationId);
    }
}
