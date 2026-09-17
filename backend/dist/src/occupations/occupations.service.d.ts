import { PrismaService } from '../prisma.service';
import { CreateOccupationDto, UpdateOccupationDto } from './dto/occupations.dto';
export declare class OccupationsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateOccupationDto): Promise<{
        id: number;
        jobName: string;
        description: string | null;
        riasecCode: string;
        mainCode: string;
        interestId: number | null;
        education: string | null;
        taskRaw: string | null;
        skillsRaw: string | null;
        imageName: string | null;
        viewCount: number;
    }>;
    update(id: number, dto: UpdateOccupationDto): Promise<{
        id: number;
        jobName: string;
        description: string | null;
        riasecCode: string;
        mainCode: string;
        interestId: number | null;
        education: string | null;
        taskRaw: string | null;
        skillsRaw: string | null;
        imageName: string | null;
        viewCount: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        jobName: string;
        description: string | null;
        riasecCode: string;
        mainCode: string;
        interestId: number | null;
        education: string | null;
        taskRaw: string | null;
        skillsRaw: string | null;
        imageName: string | null;
        viewCount: number;
    }>;
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
