/*
  Warnings:

  - Made the column `X_NOMBRE` on table `fit_usuario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `X_APELLIDO` on table `fit_usuario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `X_EMAIL` on table `fit_usuario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `X_CONTRASENA` on table `fit_usuario` required. This step will fail if there are existing NULL values in that column.
  - Made the column `X_TELEFONO` on table `fit_usuario` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `fit_usuario` MODIFY `X_NOMBRE` VARCHAR(100) NOT NULL,
    MODIFY `X_APELLIDO` VARCHAR(100) NOT NULL,
    MODIFY `X_EMAIL` VARCHAR(100) NOT NULL,
    MODIFY `X_CONTRASENA` VARCHAR(100) NOT NULL,
    MODIFY `X_TELEFONO` VARCHAR(20) NOT NULL;
