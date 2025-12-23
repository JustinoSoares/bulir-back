import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/auth.dto';
import jwt from 'jsonwebtoken';
import { user_type } from '@prisma/client';


@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) {}

        async login(authDto: AuthDto) {
        const { username, password } = authDto;

        const user = await this.prisma.user.findFirst({
            where: { OR: [{ email: username }, { nif: username }] },
        });

        if (!user) {
            throw new BadRequestException('Usuário ou senha inválidos.');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new BadRequestException('Usuário ou senha inválidos.');
        }

        const payload = { userId: user.id, email: user.email, user_type : user.user_type };
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY!);
        return { token };
    }
}
