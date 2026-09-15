import { OccupationsService } from './occupations.service';
export declare class OccupationsController {
    private readonly occupationsService;
    constructor(occupationsService: OccupationsService);
    findAll(keyword?: string, riasecCode?: string, mainCode?: string, page?: string, limit?: string): Promise<{
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
}
