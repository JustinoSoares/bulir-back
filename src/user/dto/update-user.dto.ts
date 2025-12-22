import { IsString, IsEmail, IsEnum, IsNumber, Min, IsOptional } from 'class-validator';
import { user_type } from '@prisma/client';

export class UpdateUserDto {
    @IsString({
        message: 'O nome completo deve ser uma string.',
    })
    @Min(3, {
        message: 'O nome completo deve ter pelo menos 3 caracteres.',
    })
    @IsOptional()
    full_name: string;

    @IsEmail({}, {
        message: 'O email fornecido não é válido.',
    })
    @IsOptional()
    email: string;

    @IsString({
        message: 'O NIF deve ser uma string.',
    })
    @Min(10, {
        message: 'O NIF deve ter pelo menos 10 caracteres.',
    })
    @IsOptional()
    nif: string;

    @IsString({
        message: 'A senha deve ser uma string.',
    })
    @IsOptional()
    password: string;
}