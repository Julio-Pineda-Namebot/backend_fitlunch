/*
  Warnings:

  - You are about to drop the column `X_SEX0` on the `fit_usuario` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `fit_usuario` DROP COLUMN `X_SEX0`,
    ADD COLUMN `X_SEXO` VARCHAR(10) NULL;
