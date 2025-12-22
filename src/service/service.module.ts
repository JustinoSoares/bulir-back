import { Module } from '@nestjs/common';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [ServiceService, PrismaService],
  controllers: [ServiceController]
})
export class ServiceModule {}
