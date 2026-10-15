import { Controller, Get, Query } from '@nestjs/common';
import { AvanceService } from './avance.service.js';
import { FiltroAvanceDto } from './dto/filtro-avance.dto.js';

@Controller('avance')
export class AvanceController {
  constructor(private readonly avanceService: AvanceService) {}

  @Get()
  obtenerAvance(@Query() filtros: FiltroAvanceDto) {
    return this.avanceService.obtenerResumenAvance(filtros);
  }

  @Get('distritos')
  obtenerDistritos() {
    return this.avanceService.obtenerDistritos();
  }

  @Get('tipos-eleccion')
  obtenerTiposEleccion() {
    return this.avanceService.obtenerTiposEleccion();
  }
}