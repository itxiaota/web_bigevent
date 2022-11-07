-- 以下数据名及表名，与 api_server>db>index.js 中数据库配置项一一对应，若修改了数据库与表名等，应相对应修改

-- 创建数据库
CREATE SCHEMA `my_db` ;

-- 创建 users 用户表 
CREATE TABLE `my_db`.`ev_users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `nickname` VARCHAR(255) NULL,
  `email` VARCHAR(255) NULL,
  `user_pic` TEXT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci
COMMENT = '用户信息表';

-- 创建文章类别表
CREATE TABLE `my_db`.`ev_article_cate` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `alias` VARCHAR(255) NOT NULL,
  `is_delete` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '文章分类是否是被删除\n0 表示 未被删除\n1 表示 已被删除',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE,
  UNIQUE INDEX `alias_UNIQUE` (`alias` ASC) VISIBLE)
COMMENT = '文章分类信息';

-- 创建文章信息表
CREATE TABLE `my_db`.`ev_articles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `cover_img` VARCHAR(255) NOT NULL,
  `pub_date` VARCHAR(255) NOT NULL,
  `state` VARCHAR(255) NOT NULL,
  `is_delete` TINYINT(1) NOT NULL DEFAULT 0,
  `cate_id` INT NOT NULL,
  `author_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
COMMENT = '文章信息';