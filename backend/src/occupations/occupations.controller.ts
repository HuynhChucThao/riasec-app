import { Controller, Get, Param, ParseIntPipe, Query, Req, UseGuards } from '@nestjs/common';
import { OccupationsService } from './occupations.service';

@Controller('occupations')
export class OccupationsController {
  constructor(private readonly occupationsService: OccupationsService) {}

  @Get()
  findAll(
    @Query('keyword') keyword?: string,
    @Query('riasecCode') riasecCode?: string,
    @Query('mainCode') mainCode?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.occupationsService.findAll({
      keyword,
      riasecCode,
      mainCode,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('userId') userId?: string,
  ) {
    return this.occupationsService.findOne(id, userId);
  }
}
