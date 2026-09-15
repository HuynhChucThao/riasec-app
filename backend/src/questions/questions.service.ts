import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(type?: string) {
    return this.prisma.question.findMany({
      where: type ? { type: type.toUpperCase() } : {},
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
    });
    if (!question) {
      throw new NotFoundException(`Không tìm thấy câu hỏi với ID ${id}`);
    }
    return question;
  }

  async create(dto: CreateQuestionDto) {
    return this.prisma.question.create({
      data: {
        content: dto.content,
        type: dto.type.toUpperCase(),
      },
    });
  }

  async update(id: string, dto: UpdateQuestionDto) {
    await this.findOne(id);
    return this.prisma.question.update({
      where: { id },
      data: {
        ...(dto.content && { content: dto.content }),
        ...(dto.type && { type: dto.type.toUpperCase() }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.question.delete({
      where: { id },
    });
  }
}
