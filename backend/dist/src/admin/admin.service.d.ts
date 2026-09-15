import { PrismaService } from '../prisma.service';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<{
        overview: {
            totalUsers: number;
            totalStudents: number;
            totalTests: number;
            totalOccupations: number;
            averageRating: number;
            totalFeedbacks: number;
        };
        riasecDistribution: Record<string, number>;
        recentTests: ({
            user: {
                email: string;
                name: string;
                avatarUrl: string;
            };
        } & {
            id: string;
            resultCode: string;
            scores: import("@prisma/client/runtime/library").JsonValue;
            testedAt: Date;
            userId: string;
        })[];
    }>;
}
