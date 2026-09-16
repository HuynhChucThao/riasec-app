import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionsService } from './questions.service';
export declare class QuestionsController {
    private readonly questionsService;
    constructor(questionsService: QuestionsService);
    findAll(type?: string): Promise<{
        id: string;
        content: string;
        type: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getTestSet(perType?: string): Promise<{
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
