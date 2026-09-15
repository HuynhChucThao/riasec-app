import { PrismaService } from '../prisma.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
export declare class FeedbackService {
    private prisma;
    constructor(prisma: PrismaService);
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
