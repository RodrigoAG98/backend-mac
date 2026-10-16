import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { FiltroAvanceDto } from './dto/filtro-avance.dto.js';

@Injectable()
export class AvanceService {
  constructor(private readonly dataSource: DataSource) {}

  private normalizarIds(valor?: string | string[]): number[] {
    if (!valor) return [];
    if (Array.isArray(valor)) {
      return valor.map(v => parseInt(v, 10)).filter(n => !isNaN(n));
    }
    return valor.split(',').map(v => parseInt(v, 10)).filter(n => !isNaN(n));
  }

  async obtenerResumenAvance(filtros: FiltroAvanceDto) {
    const distritosIds = this.normalizarIds(filtros.distritoId);
    const tiposEleccionIds = this.normalizarIds(filtros.tipoEleccionId);

    let whereClause = 'WHERE 1=1';
    const parameters: any[] = [];

    // Filtro dinámico por Distrito (si se selecciona)
    if (distritosIds.length > 0) {
      whereClause += ` AND d.DistritoId IN (${distritosIds.join(',')})`;
    }

    // Filtro dinámico por Tipo de Elección (si se selecciona)
    if (tiposEleccionIds.length > 0) {
      whereClause += ` AND a.TipoEleccionId IN (${tiposEleccionIds.join(',')})`;
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

        // 1. Consulta agrupada por Tipo de Elección
    const queryTipoEleccion = `
      SELECT 
        te.TipoEleccionId AS tipoEleccionId,
        te.Nombre AS tipoEleccion,
        COUNT(a.ActaId) AS esperadas,
        SUM(CASE WHEN a.Estado = 'Capturada' THEN 1 ELSE 0 END) AS capturadas,
        SUM(CASE WHEN a.Estado = 'Pendiente' THEN 1 ELSE 0 END) AS pendientes,
        CAST(
          CASE 
            WHEN COUNT(a.ActaId) = 0 THEN 0
            ELSE (SUM(CASE WHEN a.Estado = 'Capturada' THEN 1.0 ELSE 0 END) / COUNT(a.ActaId)) * 100 
          END AS DECIMAL(5,2)
        ) AS porcentajeAvance
      FROM dbo.TipoEleccion te
      LEFT JOIN dbo.Acta a ON te.TipoEleccionId = a.TipoEleccionId
      ${whereClause.replace(/d\.DistritoId/g, 'a.DistritoId')} 
      GROUP BY te.TipoEleccionId, te.Nombre
      ORDER BY te.TipoEleccionId ASC
    `;

    const detalleTiposEleccionRaw = await this.dataSource.query(queryTipoEleccion);

    // Mapear los tipos de datos numéricos del detalle
    const detalleDistritos = detalleDistritosRaw.map((row: any) => ({
      distritoId: Number(row.distritoId),
      distrito: row.distrito,
      esperadas: Number(row.esperadas || 0),
      capturadas: Number(row.capturadas || 0),
      pendientes: Number(row.pendientes || 0),
      porcentajeAvance: Number(row.porcentajeAvance || 0),
    }));

    const detalleTiposEleccion = detalleTiposEleccionRaw.map((row: any) => ({
      tipoEleccionId: Number(row.tipoEleccionId),
      tipoEleccion: row.tipoEleccion,
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
      detalleTiposEleccion
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