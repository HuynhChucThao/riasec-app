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
exports.OccupationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let OccupationsService = class OccupationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(params) {
        const { keyword, riasecCode, mainCode, page = 1, limit = 20 } = params;
        const skip = (page - 1) * limit;
        const where = {};
        if (keyword && keyword.trim()) {
            where.OR = [
                { jobName: { contains: keyword.trim() } },
                { description: { contains: keyword.trim() } },
            ];
        }
        if (mainCode && mainCode.trim()) {
            where.mainCode = mainCode.trim().toUpperCase();
        }
        if (riasecCode && riasecCode.trim()) {
            where.riasecCode = { contains: riasecCode.trim().toUpperCase() };
        }
        const [total, items] = await Promise.all([
            this.prisma.occupation.count({ where }),
            this.prisma.occupation.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: [{ viewCount: 'desc' }, { jobName: 'asc' }],
            }),
        ]);
        return {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / limit),
            items: items.map(item => this.formatOccupation(item)),
        };
    }
    async findOne(id, userId) {
        const occupation = await this.prisma.occupation.findUnique({
            where: { id },
            include: {
                savedBy: userId ? { where: { userId } } : false,
            },
        });
        if (!occupation) {
            throw new common_1.NotFoundException(`Không tìm thấy nghề nghiệp có ID ${id}`);
        }
        await this.prisma.occupation.update({
            where: { id },
            data: { viewCount: { increment: 1 } },
        });
        const isSaved = userId ? (occupation.savedBy && occupation.savedBy.length > 0) : false;
        return {
            ...this.formatOccupation(occupation),
            viewCount: occupation.viewCount + 1,
            isSaved,
        };
    }
    formatOccupation(occupation) {
        const tasks = occupation.taskRaw
            ? occupation.taskRaw.split('|').map((t) => t.trim()).filter(Boolean)
            : [];
        const skills = occupation.skillsRaw
            ? occupation.skillsRaw.split('|').map((s) => s.trim()).filter(Boolean)
            : [];
        return {
            id: occupation.id,
            jobName: occupation.jobName,
            description: occupation.description,
            riasecCode: occupation.riasecCode,
            mainCode: occupation.mainCode,
            interestId: occupation.interestId,
            education: occupation.education,
            imageName: occupation.imageName,
            viewCount: occupation.viewCount,
            tasks,
            skills,
        };
    }
};
exports.OccupationsService = OccupationsService;
exports.OccupationsService = OccupationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OccupationsService);
//# sourceMappingURL=occupations.service.js.map