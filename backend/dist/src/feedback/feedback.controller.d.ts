import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { FeedbackService } from './feedback.service';
export declare class FeedbackController {
    private readonly feedbackService;
    constructor(feedbackService: FeedbackService);
    create(userId: string, dto: CreateFeedbackDto): Promise<{
        id: string;
        createdAt: Date;
        content: string;
        userId: string;
        rating: number;
    }>;
    findAll(): Promise<({
        user: {
            id: string;
            email: string;
            name: string;
            avatarUrl: string;
        };
    } & {
        id: string;
        createdAt: Date;
        content: string;
        userId: string;
        rating: number;
    })[]>;
}
