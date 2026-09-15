import { AssessmentService } from './assessment.service';
import { SubmitTestDto } from './dto/submit-test.dto';
export declare class AssessmentController {
    private readonly assessmentService;
    constructor(assessmentService: AssessmentService);
    submitTest(userId: string, dto: SubmitTestDto): Promise<{
        testId: string;
        resultCode: string;
        primaryCode: string;
        scores: Record<string, number>;
        traits: {
            top1: {
                name: string;
                desc: string;
            };
            top2: {
                name: string;
                desc: string;
            };
            top3: {
                name: string;
                desc: string;
            };
        };
        recommendedOccupations: {
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
        }[];
        testedAt: Date;
    }>;
    getHistory(userId: string): Promise<{
        id: string;
        resultCode: string;
        scores: import("@prisma/client/runtime/library").JsonValue;
        testedAt: Date;
        userId: string;
    }[]>;
    getHistoryDetail(userId: string, id: string): Promise<{
        traits: {
            top1: {
                name: string;
                desc: string;
            };
            top2: {
                name: string;
                desc: string;
            };
            top3: {
                name: string;
                desc: string;
            };
        };
        recommendedOccupations: {
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
        }[];
        id: string;
        resultCode: string;
        scores: import("@prisma/client/runtime/library").JsonValue;
        testedAt: Date;
        userId: string;
    }>;
}
