import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
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
