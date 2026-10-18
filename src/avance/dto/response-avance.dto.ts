// response-avance.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ResumenGeneralDto {
  @ApiProperty({ description: 'Total de actas esperadas', example: 1500 })
  actasEsperadas: number;

  @ApiProperty({ description: 'Total de actas capturadas', example: 1200 })
  capturadas: number;

  @ApiProperty({ description: 'Total de actas pendientes', example: 300 })
  pendientes: number;

  @ApiProperty({ description: 'Porcentaje global de avance', example: 80.00 })
  porcentajeAvance: number;
}

export class DetalleDistritoDto {
  @ApiProperty({ description: 'ID del distrito', example: 1 })
  distritoId: number;

  @ApiProperty({ description: 'Nombre del distrito', example: 'Distrito 01' })
  distrito: string;

  @ApiProperty({ description: 'Actas esperadas en el distrito', example: 100 })
  esperadas: number;

  @ApiProperty({ description: 'Actas capturadas en el distrito', example: 85 })
  capturadas: number;

  @ApiProperty({ description: 'Actas pendientes en el distrito', example: 15 })
  pendientes: number;

  @ApiProperty({ description: 'Porcentaje de avance en el distrito', example: 85.00 })
  porcentajeAvance: number;
}

export class DetalleTipoEleccionDto {
  @ApiProperty({ description: 'ID del tipo de elección', example: 1 })
  tipoEleccionId: number;

  @ApiProperty({ description: 'Nombre del tipo de elección', example: 'Gubernatura' })
  tipoEleccion: string;

  @ApiProperty({ description: 'Actas esperadas para este tipo de elección', example: 500 })
  esperadas: number;

  @ApiProperty({ description: 'Actas capturadas', example: 400 })
  capturadas: number;

  @ApiProperty({ description: 'Actas pendientes', example: 100 })
  pendientes: number;

  @ApiProperty({ description: 'Porcentaje de avance', example: 80.00 })
  porcentajeAvance: number;
}

export class ResumenAvanceResponseDto {
  @ApiProperty({ type: ResumenGeneralDto, description: 'Resumen global consolidado sin filtros' })
  resumenGeneral: ResumenGeneralDto;

  @ApiProperty({ type: [DetalleDistritoDto], description: 'Detalle de avance agrupado por distrito' })
  detalleDistritos: DetalleDistritoDto[];

  @ApiProperty({ type: [DetalleTipoEleccionDto], description: 'Detalle de avance agrupado por tipo de elección' })
  detalleTiposEleccion: DetalleTipoEleccionDto[];
}