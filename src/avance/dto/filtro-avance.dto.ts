import { IsOptional, IsNumberString } from 'class-validator';

export class FiltroAvanceDto {
  @IsOptional()
  @IsNumberString()
  distritoId?: string;

  @IsOptional()
  @IsNumberString()
  tipoEleccionId?: string;
}