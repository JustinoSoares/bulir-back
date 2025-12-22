import { IsString, IsNumber } from "class-validator";


export class CreateServiceDto {
    @IsString({
        message: 'O nome do serviço deve ser uma string.',
    })
    name: string;

    @IsString({
        message: 'A descrição do serviço deve ser uma string.',
    })
    description: string;

    @IsNumber({}, {
        message: 'O preço do serviço deve ser um número.',
    })
    price: number;
}