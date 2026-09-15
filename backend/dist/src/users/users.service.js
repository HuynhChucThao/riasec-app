"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma.service");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                dreamWork: true,
                avatarUrl: true,
                status: true,
                createdAt: true,
                _count: {
                    select: {
                        savedJobs: true,
                        testHistory: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('Không tìm thấy người dùng');
        }
        return user;
    }
    async updateProfile(userId, dto) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                ...(dto.name !== undefined && { name: dto.name }),
                ...(dto.dreamWork !== undefined && { dreamWork: dto.dreamWork }),
                ...(dto.avatarUrl !== undefined && { avatarUrl: dto.avatarUrl }),
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                dreamWork: true,
                avatarUrl: true,
            },
        });
    }
    async findAllUsers(search) {
        return this.prisma.user.findMany({
            where: search
                ? {
                    OR: [
                        { email: { contains: search } },
                        { name: { contains: search } },
                    ],
                }
                : {},
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                dreamWork: true,
                status: true,
                createdAt: true,
                _count: {
                    select: {
                        testHistory: true,
                        savedJobs: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async toggleStatus(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('Không tìm thấy người dùng');
        }
        const nextStatus = user.status === client_1.Status.ACTIVE ? client_1.Status.INACTIVE : client_1.Status.ACTIVE;
        return this.prisma.user.update({
            where: { id: userId },
            data: { status: nextStatus },
            select: { id: true, email: true, status: true },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map