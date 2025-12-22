import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {
    // construtor para injetar o PrismaService
    constructor(private readonly prisma: PrismaService) { }

    // método para obter todos os usuários com paginação e filtro por nome
    async getUserAll(page: string, limit: string, name: string) {
        const newPage = parseInt(page) || 1; // página padrão 1
        const newLimit = parseInt(limit) || 10; // limite padrão 10
        const skip = (newPage - 1) * newLimit; // cálculo do offset

        return this.prisma.user.findMany({
            skip,
            take: newLimit,
            where: name ? {
                full_name: {
                    contains: name,
                    mode: 'insensitive',
                },
            } : {},
            omit: { password: true },
        });
    }

    // método para criar um novo usuário
    async createUser(data: CreateUserDto) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        const user = await this.prisma.user.findFirst({
            where: {
                OR: [{
                    email: data.email,
                },
                {
                    nif: data.nif
                }
                ]
            },
        });

        if (user) {
            throw new BadRequestException('Este usuário já existe.');
        }
        let balance = 0;
        if (data.user_type == "client")
            balance = 5000;
            
        const createUser = await this.prisma.user.create({
            data: { ...data, password: hashedPassword, balance: balance },
        });

        return { ...createUser, password: undefined };
    }

    // método para obter um usuário específico por ID
    async getUserEach(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new NotFoundException('Usuário não encontrado.');
        }

        return { ...user, password: undefined };
    }

    async getUserMe(req : any) {
        // Supondo que você tenha acesso ao ID do usuário autenticado
        const userId = req.user.userId; // Substitua isso pela lógica real para obter o ID do usuário autenticado

        const user = await this.prisma.user.findFirst({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new NotFoundException('Usuário não encontrado.');
        }

        return { ...user, password: undefined };
    }

    // método para atualizar um usuário existente
    async updateUser(userId: string, data: UpdateUserDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new NotFoundException('Usuário não encontrado.');
        }

        if (data.password) {
            const saltRounds = 10;
            data.password = await bcrypt.hash(data.password, saltRounds);
        }

        if (data.email || data.nif) {
            const existingUser = await this.prisma.user.findFirst({
                where: {
                    AND: [
                        {
                            id: { not: userId },
                        },
                        {
                            OR: [
                                { email: data.email || undefined },
                                { nif: data.nif || undefined },
                            ],
                        },
                    ],
                },
            });

            if (existingUser) {
                throw new BadRequestException('O email ou NIF fornecido já está em uso por outro usuário.');
            }
        }

        const updatedUser = await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                full_name: data.full_name || user.full_name,
                email: data.email || user.email,
                nif: data.nif || user.nif,
                password: data.password || user.password,
            }
        });

        return { ...updatedUser, password: undefined };
    }

    // método para deletar um usuário por ID
    async deleteUser(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new NotFoundException('Usuário não encontrado.');
        }

        await this.prisma.user.delete({
            where: {
                id: userId,
            },
        });

        return { message: 'Usuário deletado com sucesso.' };
    }
}
