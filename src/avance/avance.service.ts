import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { FiltroAvanceDto } from './dto/filtro-avance.dto.js';

@Injectable()
export class AvanceService {
  constructor(private readonly dataSource: DataSource) {}

  async obtenerResumenAvance(filtros: FiltroAvanceDto) {
    const { distritoId, tipoEleccionId } = filtros;

    let whereClause = 'WHERE 1=1';
    const parameters: any[] = [];

    // Filtro dinámico por Distrito (si se selecciona)
    if (distritoId) {
      whereClause += ` AND d.DistritoId = @${parameters.length}`;
      parameters.push(parseInt(distritoId, 10));
    }

    // Filtro dinámico por Tipo de Elección (si se selecciona)
    if (tipoEleccionId) {
      whereClause += ` AND a.TipoEleccionId = @${parameters.length}`;
      parameters.push(parseInt(tipoEleccionId, 10));
    }

    // Consulta para el detalle agrupado por distrito
    const queryDetalle = `
      SELECT 
        d.DistritoId AS distritoId,
        d.Nombre AS distrito,
        COUNT(a.ActaId) AS esperadas,
        SUM(CASE WHEN a.Estado = 'Capturada' THEN 1 ELSE 0 END) AS capturadas,
        SUM(CASE WHEN a.Estado = 'Pendiente' THEN 1 ELSE 0 END) AS pendientes,
        CAST(
          CASE 
            WHEN COUNT(a.ActaId) = 0 THEN 0
            ELSE (SUM(CASE WHEN a.Estado = 'Capturada' THEN 1.0 ELSE 0 END) / COUNT(a.ActaId)) * 100 
          END AS DECIMAL(5,2)
        ) AS porcentajeAvance
      FROM dbo.Distrito d
      LEFT JOIN dbo.Acta a ON d.DistritoId = a.DistritoId
      ${whereClause}
      GROUP BY d.DistritoId, d.Nombre
      ORDER BY d.DistritoId ASC
    `;

    const detalleDistritosRaw = await this.dataSource.query(queryDetalle, parameters);

    // Mapear los tipos de datos numéricos del detalle
    const detalleDistritos = detalleDistritosRaw.map((row: any) => ({
      distritoId: Number(row.distritoId),
      distrito: row.distrito,
      esperadas: Number(row.esperadas || 0),
      capturadas: Number(row.capturadas || 0),
      pendientes: Number(row.pendientes || 0),
      porcentajeAvance: Number(row.porcentajeAvance || 0),
    }));

    // Calcular el resumen global consolidado a partir de los resultados
    const resumenGlobal = detalleDistritos.reduce(
      (acc: any, item: any) => {
        acc.actasEsperadas += item.esperadas;
        acc.capturadas += item.capturadas;
        acc.pendientes += item.pendientes;
        return acc;
      },
      { actasEsperadas: 0, capturadas: 0, pendientes: 0 }
    );

    const porcentajeGlobal =
      resumenGlobal.actasEsperadas > 0
        ? Number(((resumenGlobal.capturadas / resumenGlobal.actasEsperadas) * 100).toFixed(2))
        : 0;

    return {
      resumenGeneral: {
        actasEsperadas: resumenGlobal.actasEsperadas,
        capturadas: resumenGlobal.capturadas,
        pendientes: resumenGlobal.pendientes,
        porcentajeAvance: porcentajeGlobal,
      },
      detalleDistritos,
    };
  }

  // Métodos auxiliares para llenar los selectores en Angular
  async obtenerDistritos() {
    return await this.dataSource.query('SELECT DistritoId, Nombre FROM dbo.Distrito');
  }

  async obtenerTiposEleccion() {
    return await this.dataSource.query('SELECT TipoEleccionId, Nombre FROM dbo.TipoEleccion');
  }
}