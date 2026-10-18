// response-avance.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class TipoEleccionDto {
  @ApiProperty({ description: 'Total de actas esperadas', example: 1500 })
  actasEsperadas: number;

  @ApiProperty({ description: 'Total de actas capturadas', example: 1200 })
  capturadas: number;
}