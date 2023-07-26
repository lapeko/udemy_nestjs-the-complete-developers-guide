import { DiskService } from './../disk/disk.service';
import { CpuService } from './../cpu/cpu.service';
import { Controller, Get } from '@nestjs/common';

@Controller('computer')
export class ComputerController {
  constructor(
    private cpuService: CpuService,
    private diskService: DiskService,
  ) {}

  @Get()
  run() {
    return [this.diskService.getData(), this.cpuService.compute(2, 3)];
  }
}
