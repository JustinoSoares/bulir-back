import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // marca como global
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // exporta para qualquer módulo
})
export class PrismaModule {}
