import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvanceModule } from './avance/avance.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'backend-mac',
    }),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'localhost', // o 127.0.0.1
      port: 1433,
      username: 'sa', // Tu usuario de SQL Server
      password: 'RootPassword1*', // Tu contraseña
      database: 'MonitorCapturaPrueba',
      entities: [],
      synchronize: false, // NO sincronizar esquema (usamos la BD existente)
      options: {
        encrypt: false, // Pon true si usas Azure o SSL
        trustServerCertificate: true,
      },
    }),
    AvanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
