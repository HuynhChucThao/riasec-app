import { PrismaService } from '../prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
export declare class QuestionsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(type?: string): Promise<{
        id: string;
        content: string;
        type: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findBalancedTestSet(perType?: number): Promise<{
        id: string;
        content: string;
        type: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        content: string;
        type: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(dto: CreateQuestionDto): Promise<{
        id: string;
        content: string;
        type: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, dto: UpdateQuestionDto): Promise<{
        id: string;
        content: string;
        type: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        content: string;
        type: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
