import { AiConsultantService } from './ai-consultant.service';
import { ChatAiDto } from './dto/chat-ai.dto';
export declare class AiConsultantController {
    private readonly aiService;
    constructor(aiService: AiConsultantService);
    chat(userId: string, dto: ChatAiDto): Promise<{
        reply: any;
    }>;
}
