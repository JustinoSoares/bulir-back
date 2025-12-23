import { IsString, IsNumber, IsOptional } from "class-validator";


export class UpdateServiceDto {
    @IsString({
        message: 'O nome do serviço deve ser uma string.',
    })
    @IsOptional()
    name: string;

    @IsString({
        message: 'A descrição do serviço deve ser uma string.',
    })
    @IsOptional()
    description: string;

    @IsNumber({}, {
        message: 'O preço do serviço deve ser um número.',
    })
    @IsOptional()
    price: number;
}