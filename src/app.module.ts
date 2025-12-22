import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { ServiceService } from './service/service.service';
import { ServiceModule } from './service/service.module';
import { ReservationService } from './reservation/reservation.service';
import { ReservationController } from './reservation/reservation.controller';
import { ReservationModule } from './reservation/reservation.module';
import { ServiceController } from './service/service.controller';

@Module({
  imports: [
    UserModule, 
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ServiceModule,
    ReservationModule,
  ],
  controllers: [AppController, AuthController, ReservationController, ServiceController],
  providers: [AppService, PrismaService, AuthService, ServiceService,  ReservationService],
})
export class AppModule {}
