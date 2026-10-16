import { IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FiltroAvanceDto {
  @ApiPropertyOptional({
    description: 'ID o lista de IDs de distritos a filtrar (puede ser un string único o array)',
    example: ['1', '2'],
    oneOf: [
      { type: 'string', example: '1' },
      { type: 'array', items: { type: 'string' }, example: ['1', '2'] },
    ],
  })
  @IsOptional()
  distritoId?: string | string[];

  @ApiPropertyOptional({
    description: 'ID o lista de IDs de tipos de elección a filtrar',
    example: ['1'],
    oneOf: [
      { type: 'string', example: '1' },
      { type: 'array', items: { type: 'string' }, example: ['1', '2'] },
    ],
  })
  @IsOptional()
  tipoEleccionId?: string | string[];
}