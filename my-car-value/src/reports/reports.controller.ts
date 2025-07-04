import {
  Body,
  Controller, Get,
  Param,
  Patch,
  Post, Query,
  UseGuards,
} from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report-dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../users/users.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CreateReportResponseDto } from './dtos/create-report-response-dto';
import { AdminGuard } from '../guards/admin.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { GetEstimateDto } from './dtos/get-estimate-dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get()
  getReports(@Query() query: GetEstimateDto) {
    return this.reportsService.getReport(query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(CreateReportResponseDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }

  @Post('/approve/:id')
  @UseGuards(AdminGuard)
  approve(@Param('id') id: number) {
    return this.reportsService.approve(id);
  }
}
