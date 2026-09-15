import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AssessmentService } from './assessment.service';
import { SubmitTestDto } from './dto/submit-test.dto';

@UseGuards(JwtAuthGuard)
@Controller('assessment')
export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) {}

  @Post('submit')
  submitTest(@CurrentUser('id') userId: string, @Body() dto: SubmitTestDto) {
    return this.assessmentService.submitTest(userId, dto);
  }

  @Get('history')
  getHistory(@CurrentUser('id') userId: string) {
    return this.assessmentService.getHistory(userId);
  }

  @Get('history/:id')
  getHistoryDetail(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.assessmentService.getHistoryDetail(userId, id);
  }
}
