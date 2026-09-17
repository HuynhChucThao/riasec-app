import { PrismaService } from '../prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
export declare class QuestionsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(type?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        type: string;
    }[]>;
    findBalancedTestSet(perType?: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        type: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        type: string;
    }>;
    create(dto: CreateQuestionDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        type: string;
    }>;
    update(id: string, dto: UpdateQuestionDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        type: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        type: string;
    }>;
}
