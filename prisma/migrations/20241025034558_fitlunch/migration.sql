/*
  Warnings:

  - You are about to drop the `fitusuario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `fitusuario`;

-- CreateTable
CREATE TABLE `fit_comida` (
    `N_ID_COMIDA` INTEGER NOT NULL AUTO_INCREMENT,
    `X_NOMBRE_COMIDA` VARCHAR(100) NULL,
    `X_DESCRIPCION` TEXT NULL,
    `N_CALORIAS` INTEGER NULL,
    `X_TIPO_COMIDA` ENUM('Desayuno', 'Almuerzo', 'Cena') NULL,

    PRIMARY KEY (`N_ID_COMIDA`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fit_comida_detalle` (
    `N_ID_DETALLE_COMIDA` INTEGER NOT NULL AUTO_INCREMENT,
    `N_ID_COMIDA` INTEGER NULL,
    `N_ID_INGREDIENTE` INTEGER NULL,
    `N_CANTIDAD` DOUBLE NULL,

    INDEX `N_ID_COMIDA`(`N_ID_COMIDA`),
    INDEX `N_ID_INGREDIENTE`(`N_ID_INGREDIENTE`),
    PRIMARY KEY (`N_ID_DETALLE_COMIDA`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fit_costos` (
    `N_ID_COSTO_INGREDIENTE` INTEGER NOT NULL AUTO_INCREMENT,
    `N_ID_INGREDIENTE` INTEGER NULL,
    `N_ID_DELIVERY` INTEGER NULL,
    `F_REGISTRO` DATETIME(0) NULL,
    `N_COSTO_UNIT` DOUBLE NULL,
    `N_CANTIDAD` DOUBLE NULL,
    `N_SUBTOTAL_INGREDIENTES` DOUBLE NULL,
    `N_COSTO_TOTAL` DOUBLE NULL,

    INDEX `N_ID_INGREDIENTE`(`N_ID_INGREDIENTE`),
    PRIMARY KEY (`N_ID_COSTO_INGREDIENTE`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fit_delivery` (
    `N_ID_DELIVERY` INTEGER NOT NULL AUTO_INCREMENT,
    `N_ID_PEDIDO` INTEGER NULL,
    `N_COSTO_DELIVERY` DOUBLE NULL,
    `X_ENCARGADO` VARCHAR(100) NULL,
    `F_PEDIDO` DATE NULL,

    PRIMARY KEY (`N_ID_DELIVERY`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fit_ingredientes` (
    `N_ID_INGREDIENTE` INTEGER NOT NULL AUTO_INCREMENT,
    `N_ID_UNIDAD_MEDIDA` INTEGER NULL,
    `X_NOMBRE_INGREDIENTE` VARCHAR(100) NULL,
    `F_INGRESO` DATETIME(0) NULL,
    `X_DESCRIPCION` TEXT NULL,
    `N_CANTIDAD` DOUBLE NULL,
    `N_COSTO_UNIT` DOUBLE NULL,
    `N_CALORIAS` INTEGER NULL,

    INDEX `N_ID_UNIDAD_MEDIDA`(`N_ID_UNIDAD_MEDIDA`),
    PRIMARY KEY (`N_ID_INGREDIENTE`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fit_pago` (
    `N_ID_PAGO` INTEGER NOT NULL AUTO_INCREMENT,
    `N_ID_USUARIO` INTEGER NULL,
    `N_ID_PLAN` INTEGER NULL,
    `N_MONTO` DOUBLE NULL,
    `X_METODO_PAGO` VARCHAR(50) NULL,
    `F_PAGO` DATE NULL,
    `X_ESTADO_PAGO` ENUM('Pendiente', 'Completado', 'Fallido') NULL,

    INDEX `N_ID_PLAN`(`N_ID_PLAN`),
    INDEX `N_ID_USUARIO`(`N_ID_USUARIO`),
    PRIMARY KEY (`N_ID_PAGO`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fit_pedido` (
    `N_ID_PEDIDO` INTEGER NOT NULL AUTO_INCREMENT,
    `F_PEDIDO` DATETIME(0) NULL,
    `X_ESTADO_PEDIDO` ENUM('Completado', 'Cancelado') NULL,
    `X_DIRECCION` VARCHAR(255) NULL,

    PRIMARY KEY (`N_ID_PEDIDO`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fit_pedido_detalle` (
    `N_ID_DETALLE_PEDIDO` INTEGER NOT NULL AUTO_INCREMENT,
    `N_ID_PEDIDO` INTEGER NULL,
    `N_ID_COMIDA` INTEGER NULL,
    `N_CANTIDAD` INTEGER NULL,

    INDEX `N_ID_PEDIDO`(`N_ID_PEDIDO`),
    PRIMARY KEY (`N_ID_DETALLE_PEDIDO`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fit_plan` (
    `N_ID_PLAN` INTEGER NOT NULL AUTO_INCREMENT,
    `X_NOMBRE_PLAN` VARCHAR(100) NULL,
    `X_DESCRIPCION` TEXT NULL,
    `N_PRECIO` DOUBLE NULL,
    `N_TIEMPO_DURACION` INTEGER NULL,

    PRIMARY KEY (`N_ID_PLAN`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fit_unidad_medida` (
    `N_ID_UNIDAD_MEDIDA` INTEGER NOT NULL AUTO_INCREMENT,
    `X_UNIDAD_MEDIDA` VARCHAR(50) NULL,
    `X_ABREV_UNIDAD_MEDIDA` VARCHAR(10) NULL,
    `X_TIPO_UNIDAD` ENUM('Masa', 'Volumen', 'Cantidad') NULL,

    PRIMARY KEY (`N_ID_UNIDAD_MEDIDA`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fit_usuario` (
    `N_ID_USUARIO` INTEGER NOT NULL AUTO_INCREMENT,
    `N_ID_PLAN` INTEGER NULL,
    `X_NOMBRE` VARCHAR(100) NULL,
    `X_APELLIDO` VARCHAR(100) NULL,
    `X_EMAIL` VARCHAR(100) NULL,
    `X_CONTRASENA` VARCHAR(100) NULL,
    `X_DIRECCION` VARCHAR(255) NULL,
    `X_TELEFONO` VARCHAR(20) NULL,
    `F_REGISTRO` DATETIME(0) NULL,
    `X_CODIGO_VERIFICACION` VARCHAR(6) NULL,

    INDEX `N_ID_PLAN`(`N_ID_PLAN`),
    PRIMARY KEY (`N_ID_USUARIO`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `fit_comida_detalle` ADD CONSTRAINT `fit_comida_detalle_ibfk_1` FOREIGN KEY (`N_ID_COMIDA`) REFERENCES `fit_comida`(`N_ID_COMIDA`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `fit_comida_detalle` ADD CONSTRAINT `fit_comida_detalle_ibfk_2` FOREIGN KEY (`N_ID_INGREDIENTE`) REFERENCES `fit_ingredientes`(`N_ID_INGREDIENTE`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `fit_costos` ADD CONSTRAINT `fit_costos_ibfk_1` FOREIGN KEY (`N_ID_INGREDIENTE`) REFERENCES `fit_ingredientes`(`N_ID_INGREDIENTE`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `fit_ingredientes` ADD CONSTRAINT `fit_ingredientes_ibfk_1` FOREIGN KEY (`N_ID_UNIDAD_MEDIDA`) REFERENCES `fit_unidad_medida`(`N_ID_UNIDAD_MEDIDA`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `fit_pago` ADD CONSTRAINT `fit_pago_ibfk_1` FOREIGN KEY (`N_ID_USUARIO`) REFERENCES `fit_usuario`(`N_ID_USUARIO`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `fit_pago` ADD CONSTRAINT `fit_pago_ibfk_2` FOREIGN KEY (`N_ID_PLAN`) REFERENCES `fit_plan`(`N_ID_PLAN`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `fit_pedido_detalle` ADD CONSTRAINT `fit_pedido_detalle_ibfk_1` FOREIGN KEY (`N_ID_PEDIDO`) REFERENCES `fit_pedido`(`N_ID_PEDIDO`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `fit_usuario` ADD CONSTRAINT `fit_usuario_ibfk_1` FOREIGN KEY (`N_ID_PLAN`) REFERENCES `fit_plan`(`N_ID_PLAN`) ON DELETE RESTRICT ON UPDATE RESTRICT;
