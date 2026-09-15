import { PrismaService } from '../prisma.service';
import { ChatAiDto } from './dto/chat-ai.dto';
export declare class AiConsultantService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    chat(userId: string, dto: ChatAiDto): Promise<{
        reply: any;
    }>;
}
