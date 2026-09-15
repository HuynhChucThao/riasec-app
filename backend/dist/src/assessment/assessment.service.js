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
exports.AssessmentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const RIASEC_TYPE_INFO = {
    R: {
        name: 'Realistic (Thực tế - Kỹ thuật)',
        desc: 'Thích làm việc với các đồ vật, công cụ, máy móc, động thực vật hoặc các hoạt động ngoài trời. Thích giải quyết các vấn đề thực tế và cụ thể.',
    },
    I: {
        name: 'Investigative (Nghiên cứu - Khám phá)',
        desc: 'Thích quan sát, tìm hiểu, phân tích, giải quyết các vấn đề khoa học hoặc tư duy trừu tượng. Ham học hỏi và thích nghiên cứu sâu.',
    },
    A: {
        name: 'Artistic (Nghệ thuật - Sáng tạo)',
        desc: 'Thích sự sáng tạo, tự do, biểu đạt cảm xúc qua nghệ thuật, thiết kế, âm nhạc hoặc viết lách. Không thích sự gò bó theo khuôn mẫu.',
    },
    S: {
        name: 'Social (Xã hội - Giúp đỡ)',
        desc: 'Thích làm việc với con người, giảng dạy, tư vấn, chăm sóc, truyền cảm hứng hoặc hỗ trợ cộng đồng. Có kỹ năng giao tiếp tốt.',
    },
    E: {
        name: 'Enterprising (Quản lý - Lãnh đạo)',
        desc: 'Thích dẫn dắt, thuyết phục, kinh doanh, đưa ra quyết định chiến lược và đạt được các mục tiêu tổ chức hoặc kinh tế.',
    },
    C: {
        name: 'Conventional (Nghiệp vụ - Chi tiết)',
        desc: 'Thích làm việc với dữ liệu, số liệu, quy trình rõ ràng, tính toán cẩn thận và có tổ chức, quy củ cao.',
    },
};
let AssessmentService = class AssessmentService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async submitTest(userId, dto) {
        if (!dto.answers || dto.answers.length === 0) {
            throw new common_1.BadRequestException('Bài làm chưa có câu trả lời nào');
        }
        const questionIds = dto.answers.map(a => a.questionId);
        const questions = await this.prisma.question.findMany({
            where: { id: { in: questionIds } },
        });
        const questionMap = new Map();
        questions.forEach(q => questionMap.set(q.id, q.type.toUpperCase()));
        const scores = {
            R: 0,
            I: 0,
            A: 0,
            S: 0,
            E: 0,
            C: 0,
        };
        for (const answer of dto.answers) {
            const type = questionMap.get(answer.questionId);
            if (type && scores[type] !== undefined) {
                scores[type] += answer.score;
            }
        }
        const sortedTypes = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        const top1 = sortedTypes[0][0];
        const top2 = sortedTypes[1][0];
        const top3 = sortedTypes[2][0];
        const resultCode = `${top1}${top2}${top3}`;
        const testHistory = await this.prisma.testHistory.create({
            data: {
                userId,
                resultCode,
                scores,
            },
        });
        const recommendedOccupations = await this.prisma.occupation.findMany({
            where: {
                OR: [
                    { riasecCode: { contains: top1 } },
                    { mainCode: top1 },
                ],
            },
            take: 8,
            orderBy: { viewCount: 'desc' },
        });
        return {
            testId: testHistory.id,
            resultCode,
            primaryCode: top1,
            scores,
            traits: {
                top1: RIASEC_TYPE_INFO[top1] || null,
                top2: RIASEC_TYPE_INFO[top2] || null,
                top3: RIASEC_TYPE_INFO[top3] || null,
            },
            recommendedOccupations,
            testedAt: testHistory.testedAt,
        };
    }
    async getHistory(userId) {
        return this.prisma.testHistory.findMany({
            where: { userId },
            orderBy: { testedAt: 'desc' },
        });
    }
    async getHistoryDetail(userId, id) {
        const history = await this.prisma.testHistory.findFirst({
            where: { id, userId },
        });
        if (!history) {
            throw new common_1.NotFoundException('Không tìm thấy kết quả bài test');
        }
        const top1 = history.resultCode[0] || 'R';
        const recommendedOccupations = await this.prisma.occupation.findMany({
            where: {
                OR: [
                    { riasecCode: { contains: top1 } },
                    { mainCode: top1 },
                ],
            },
            take: 8,
            orderBy: { viewCount: 'desc' },
        });
        return {
            ...history,
            traits: {
                top1: RIASEC_TYPE_INFO[history.resultCode[0]] || null,
                top2: RIASEC_TYPE_INFO[history.resultCode[1]] || null,
                top3: RIASEC_TYPE_INFO[history.resultCode[2]] || null,
            },
            recommendedOccupations,
        };
    }
};
exports.AssessmentService = AssessmentService;
exports.AssessmentService = AssessmentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AssessmentService);
//# sourceMappingURL=assessment.service.js.map