import { PrismaService } from '../prisma.service';
export declare class SavedJobsService {
    private prisma;
    constructor(prisma: PrismaService);
    toggleSave(userId: string, occupationId: number): Promise<{
        isSaved: boolean;
        message: string;
    }>;
    getSavedJobs(userId: string): Promise<{
        savedAt: Date;
        occupation: {
            id: number;
            jobName: string;
            description: string;
            riasecCode: string;
            mainCode: string;
            education: string;
            imageName: string;
            viewCount: number;
        };
    }[]>;
}
