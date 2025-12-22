import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReservationService } from './reservation.service';

@Module({
    controllers: [ReservationController],
    providers: [ReservationService, PrismaService],
})
export class ReservationModule {}
