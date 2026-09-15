import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { QuestionsModule } from './questions/questions.module';
import { AssessmentModule } from './assessment/assessment.module';
import { OccupationsModule } from './occupations/occupations.module';
import { SavedJobsModule } from './saved-jobs/saved-jobs.module';
import { AiConsultantModule } from './ai-consultant/ai-consultant.module';
import { FeedbackModule } from './feedback/feedback.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    QuestionsModule,
    AssessmentModule,
    OccupationsModule,
    SavedJobsModule,
    AiConsultantModule,
    FeedbackModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
