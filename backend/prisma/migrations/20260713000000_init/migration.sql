-- CreateTable
CREATE TABLE `customer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customer_name` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20) NULL,
    `address` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deleted_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `level` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `level_name` VARCHAR(50) NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deleted_at` TIMESTAMP(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trans_laundry_pickup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_order` INTEGER NOT NULL,
    `id_customer` INTEGER NOT NULL,
    `pickup_date` DATE NULL,
    `notes` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_pickup_customer`(`id_customer`),
    INDEX `fk_pickup_order`(`id_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trans_order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_customer` INTEGER NOT NULL,
    `order_code` VARCHAR(50) NULL,
    `order_date` DATE NULL,
    `order_qty` INTEGER NULL,
    `order_total` DECIMAL(10, 2) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deleted_at` TIMESTAMP(0) NULL,
    `order_change` DECIMAL(10, 2) NULL,
    `total` DECIMAL(10, 2) NULL,
    `payment_status` VARCHAR(20) NOT NULL DEFAULT 'Lunas',

    UNIQUE INDEX `order_code`(`order_code`),
    INDEX `fk_order_customer`(`id_customer`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trans_order_detail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_order` INTEGER NOT NULL,
    `id_service` INTEGER NOT NULL,
    `qty` INTEGER NOT NULL,
    `amount` DECIMAL(10, 2) NULL,
    `notes` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_detail_order`(`id_order`),
    INDEX `fk_detail_service`(`id_service`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `type_of_service` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `service_name` VARCHAR(50) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `description` TEXT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deleted_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `service_name`(`service_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_level` INTEGER NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `id_level`(`id_level`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `trans_laundry_pickup` ADD CONSTRAINT `fk_pickup_customer` FOREIGN KEY (`id_customer`) REFERENCES `customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trans_laundry_pickup` ADD CONSTRAINT `fk_pickup_order` FOREIGN KEY (`id_order`) REFERENCES `trans_order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trans_order` ADD CONSTRAINT `fk_order_customer` FOREIGN KEY (`id_customer`) REFERENCES `customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trans_order_detail` ADD CONSTRAINT `fk_detail_order` FOREIGN KEY (`id_order`) REFERENCES `trans_order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trans_order_detail` ADD CONSTRAINT `fk_detail_service` FOREIGN KEY (`id_service`) REFERENCES `type_of_service`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`id_level`) REFERENCES `level`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
