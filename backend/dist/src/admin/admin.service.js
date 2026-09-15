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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma.service");
let AdminService = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const [totalUsers, totalStudents, totalTests, totalOccupations, feedbacks, recentTests, allTests,] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({ where: { role: client_1.Role.STUDENT } }),
            this.prisma.testHistory.count(),
            this.prisma.occupation.count(),
            this.prisma.feedback.findMany({ select: { rating: true } }),
            this.prisma.testHistory.findMany({
                take: 5,
                orderBy: { testedAt: 'desc' },
                include: {
                    user: {
                        select: { name: true, email: true, avatarUrl: true },
                    },
                },
            }),
            this.prisma.testHistory.findMany({ select: { resultCode: true } }),
        ]);
        const averageRating = feedbacks.length > 0
            ? (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length).toFixed(1)
            : '5.0';
        const distribution = {
            R: 0,
            I: 0,
            A: 0,
            S: 0,
            E: 0,
            C: 0,
        };
        allTests.forEach(test => {
            const primary = test.resultCode?.[0]?.toUpperCase();
            if (primary && distribution[primary] !== undefined) {
                distribution[primary]++;
            }
        });
        return {
            overview: {
                totalUsers,
                totalStudents,
                totalTests,
                totalOccupations,
                averageRating: parseFloat(averageRating),
                totalFeedbacks: feedbacks.length,
            },
            riasecDistribution: distribution,
            recentTests,
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map