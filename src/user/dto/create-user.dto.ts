import { IsString, IsEmail, IsEnum, IsNumber, Min, MinLength } from 'class-validator';
import { user_type } from '@prisma/client';

export class CreateUserDto {
  @IsString({
    message: 'O nome completo deve ser uma string.',
  })
  @MinLength(3, {
    message: 'O nome completo deve ter pelo menos 3 caracteres.',
  })
  full_name: string;

  @IsEmail({},{
      message: 'O email fornecido não é válido.',
  })
  email: string;

  @IsString({
    message: 'O NIF deve ser uma string.',
  })
  @MinLength(10, {
    message: 'O NIF deve ter pelo menos 10 caracteres.',
  })
  nif: string;

  @IsString({
    message: 'A senha deve ser uma string.',
  })
  password: string;


  @IsEnum(user_type, {
    message: `O tipo de usuário deve ser um Cliente ou um Prestador de serviço.`,
  })
  user_type: user_type;
}