import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // remove propriedades não declaradas no DTO
    forbidNonWhitelisted: true, // lança erro se houver propriedades não declaradas
    transform: true, // transforma payloads para os tipos declarados nos DTOs
    
    // customiza a mensagem de erro para o primeiro erro encontrado
    exceptionFactory: (errors) => {
      const firstError = errors[0];
      const FirstMessage = firstError ? Object.values(firstError.constraints!)[0] : 'Validation error';
      return new BadRequestException(FirstMessage);
    }
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
