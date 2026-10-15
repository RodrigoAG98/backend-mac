import { IsOptional, IsNumberString } from 'class-validator';

export class FiltroAvanceDto {
  @IsOptional()
  distritoId?: string | string[];

  @IsOptional()
  tipoEleccionId?: string | string[];
}