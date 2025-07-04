import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './reports.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report-dto';
import { User } from '../users/users.entity';
import { GetEstimateDto } from './dtos/get-estimate-dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  async getReport(report: GetEstimateDto) {
    return this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('LOWER(maker) = :maker', { maker: report.maker.toLowerCase() })
      .andWhere('LOWER(model) = :model', { model: report.model.toLowerCase() })
      .andWhere('year - :year BETWEEN -3 AND 3', { year: report.year })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng: report.lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat: report.lat })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage: report.mileage })
      .limit(3)
      .getRawOne();
  }

  create(body: CreateReportDto, user: User) {
    const report = this.repo.create(body);
    report.user = user;

    return this.repo.save(report);
  }

  async approve(id: number) {
    const report = await this.repo.findOneBy({ id });
    if (!report) throw new NotFoundException(`Report with id ${id} not found`);
    report.approved = true;
    return this.repo.save(report);
  }
}
