import { IsString } from "class-validator";

export class AuthDto {
  @IsString({
    message: 'O email deve ser uma string.',
  })
  username: string;

  @IsString({
    message: 'A senha deve ser uma string.',
  })
  password: string;
}