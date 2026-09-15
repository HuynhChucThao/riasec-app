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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../prisma.service");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(dto) {
        const existing = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase() },
        });
        if (existing) {
            throw new common_1.BadRequestException('Email này đã được đăng ký');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(dto.password, salt);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email.toLowerCase(),
                password: hashedPassword,
                name: dto.name || 'Học sinh',
                dreamWork: dto.dreamWork || null,
                role: client_1.Role.STUDENT,
                status: client_1.Status.ACTIVE,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                dreamWork: true,
                avatarUrl: true,
                createdAt: true,
            },
        });
        const token = this.generateToken(user.id, user.email, user.role);
        return {
            message: 'Đăng ký thành công',
            user,
            accessToken: token,
        };
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase() },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Email hoặc mật khẩu không chính xác');
        }
        if (user.status === client_1.Status.INACTIVE) {
            throw new common_1.UnauthorizedException('Tài khoản đã bị tạm khóa');
        }
        const isMatch = await bcrypt.compare(dto.password, user.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Email hoặc mật khẩu không chính xác');
        }
        const token = this.generateToken(user.id, user.email, user.role);
        return {
            message: 'Đăng nhập thành công',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                dreamWork: user.dreamWork,
                avatarUrl: user.avatarUrl,
            },
            accessToken: token,
        };
    }
    async getMe(userId) {
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
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Người dùng không tồn tại');
        }
        return user;
    }
    generateToken(userId, email, role) {
        const payload = { sub: userId, email, role };
        return this.jwtService.sign(payload);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map