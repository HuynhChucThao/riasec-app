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
exports.SavedJobsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let SavedJobsService = class SavedJobsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async toggleSave(userId, occupationId) {
        const occupation = await this.prisma.occupation.findUnique({
            where: { id: occupationId },
        });
        if (!occupation) {
            throw new common_1.NotFoundException('Không tìm thấy nghề nghiệp này');
        }
        const existing = await this.prisma.savedJob.findUnique({
            where: {
                userId_occupationId: {
                    userId,
                    occupationId,
                },
            },
        });
        if (existing) {
            await this.prisma.savedJob.delete({
                where: { id: existing.id },
            });
            return { isSaved: false, message: 'Đã bỏ lưu nghề nghiệp' };
        }
        else {
            await this.prisma.savedJob.create({
                data: {
                    userId,
                    occupationId,
                },
            });
            return { isSaved: true, message: 'Đã lưu nghề nghiệp thành công' };
        }
    }
    async getSavedJobs(userId) {
        const savedJobs = await this.prisma.savedJob.findMany({
            where: { userId },
            include: {
                occupation: true,
            },
            orderBy: { savedAt: 'desc' },
        });
        return savedJobs.map(item => ({
            savedAt: item.savedAt,
            occupation: {
                id: item.occupation.id,
                jobName: item.occupation.jobName,
                description: item.occupation.description,
                riasecCode: item.occupation.riasecCode,
                mainCode: item.occupation.mainCode,
                education: item.occupation.education,
                imageName: item.occupation.imageName,
                viewCount: item.occupation.viewCount,
            },
        }));
    }
};
exports.SavedJobsService = SavedJobsService;
exports.SavedJobsService = SavedJobsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SavedJobsService);
//# sourceMappingURL=saved-jobs.service.js.map