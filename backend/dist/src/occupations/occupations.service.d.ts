import { PrismaService } from '../prisma.service';
export declare class OccupationsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(params: {
        keyword?: string;
        riasecCode?: string;
        mainCode?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        items: {
            id: any;
            jobName: any;
            description: any;
            riasecCode: any;
            mainCode: any;
            interestId: any;
            education: any;
            imageName: any;
            viewCount: any;
            tasks: any;
            skills: any;
        }[];
    }>;
    findOne(id: number, userId?: string): Promise<{
        viewCount: number;
        isSaved: boolean;
        id: any;
        jobName: any;
        description: any;
        riasecCode: any;
        mainCode: any;
        interestId: any;
        education: any;
        imageName: any;
        tasks: any;
        skills: any;
    }>;
    private formatOccupation;
}
