import { SavedJobsService } from './saved-jobs.service';
export declare class SavedJobsController {
    private readonly savedJobsService;
    constructor(savedJobsService: SavedJobsService);
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
