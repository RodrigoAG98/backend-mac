import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiOkResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { AvanceService } from './avance.service.js';
import { FiltroAvanceDto } from './dto/filtro-avance.dto.js';

@Controller('avance')
export class AvanceController {
  constructor(private readonly avanceService: AvanceService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener resumen general y detalle de avance',
    description: 'Devuelve las métricas globales de avance (sin filtros) y el detalle agrupado por distrito y tipo de elección (aplicando filtros opcionales).',
  })
  @ApiOkResponse({
    description: 'Resumen y detalle del avance obtenidos exitosamente.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Error interno en el servidor al consultar los datos.',
  })
  obtenerAvance(@Query() filtros: FiltroAvanceDto) {
    return this.avanceService.obtenerResumenAvance(filtros);
  }

  @Get('distritos')
  @ApiOperation({
    summary: 'Obtener listado de todos los distritos',
    description: 'Devuelve los distritos.',
  })
  @ApiOkResponse({
    description: 'Detalle de los distritos obtenidos exitosamente.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Error interno en el servidor al consultar los datos.',
  })
  obtenerDistritos() {
    return this.avanceService.obtenerDistritos();
  }

  @Get('tipos-eleccion')
  @ApiOperation({
    summary: 'Obtener listado de los tipos de elección',
    description: 'Devuelve los tipos de elección.',
  })
  @ApiOkResponse({
    description: 'Detalle de los tipos de elección obtenidos exitosamente.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Error interno en el servidor al consultar los datos.',
  })
  obtenerTiposEleccion() {
    return this.avanceService.obtenerTiposEleccion();
  }
}