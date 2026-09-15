import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AiConsultantService } from './ai-consultant.service';
import { ChatAiDto } from './dto/chat-ai.dto';

@UseGuards(JwtAuthGuard)
@Controller('ai-consultant')
export class AiConsultantController {
  constructor(private readonly aiService: AiConsultantService) {}

  @Post('chat')
  chat(@CurrentUser('id') userId: string, @Body() dto: ChatAiDto) {
    return this.aiService.chat(userId, dto);
  }
}
