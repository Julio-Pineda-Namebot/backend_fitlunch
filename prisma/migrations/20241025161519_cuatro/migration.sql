/*
  Warnings:

  - A unique constraint covering the columns `[X_EMAIL]` on the table `fit_usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `fit_usuario_X_EMAIL_key` ON `fit_usuario`(`X_EMAIL`);
