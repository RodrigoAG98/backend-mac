## Description

Backend para proyecto de Monitoreo de Avance de Captura.
Prueba técnica desarrollada con la ayuda de IA(Gemini) para reducir tiempo de desarrollo.
Los pasos para levantar el backend son los siguientes:

## Requisitos

1. Se requiere una base de datos SQL Server. Se puede usar docker para levantar el servicio.
  dentro de la carpeta src/app.module.ts se pueden realizar con cambios necesarios para apuntar correctamente a los datos de tu BD.
2. Ejecutar respaldo de la BD en DatGrip o TablePlus o algún otro gestor de BD.
3. Importar o ejecutar SQL(Crea e inserta datos).
4. (Opcional) en caso de que el front se encuentre en otro puerto tendrás que realizar un ajuste en src/main.ts con la ruta    correcta al front.

```bash
#Instalar dependencias
$ pnpm install
# Levantar servidor
$ pnpm run start
```

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```
