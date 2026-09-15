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
exports.QuestionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let QuestionsService = class QuestionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(type) {
        return this.prisma.question.findMany({
            where: type ? { type: type.toUpperCase() } : {},
            orderBy: { createdAt: 'asc' },
        });
    }
    async findOne(id) {
        const question = await this.prisma.question.findUnique({
            where: { id },
        });
        if (!question) {
            throw new common_1.NotFoundException(`Không tìm thấy câu hỏi với ID ${id}`);
        }
        return question;
    }
    async create(dto) {
        return this.prisma.question.create({
            data: {
                content: dto.content,
                type: dto.type.toUpperCase(),
            },
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.question.update({
            where: { id },
            data: {
                ...(dto.content && { content: dto.content }),
                ...(dto.type && { type: dto.type.toUpperCase() }),
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.question.delete({
            where: { id },
        });
    }
};
exports.QuestionsService = QuestionsService;
exports.QuestionsService = QuestionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuestionsService);
//# sourceMappingURL=questions.service.js.map