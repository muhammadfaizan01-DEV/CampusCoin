-- ============================================================================
-- CampusCoin Web Application - SQL Database Schema Definition
-- Theme: NextGen BudgetBee | Category: End-to-End Web Solutions
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `campuscoin_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `campuscoin_db`;

-- ----------------------------------------------------------------------------
-- Table: users
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(120) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('student', 'admin') DEFAULT 'student',
  `academic_year` VARCHAR(50) DEFAULT 'Freshman (1st Year)',
  `monthly_allowance_baseline` DECIMAL(10,2) DEFAULT '500.00',
  `savings_goal` DECIMAL(10,2) DEFAULT '100.00',
  `avatar` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Users
INSERT INTO `users` (`user_id`, `name`, `email`, `password_hash`, `role`, `academic_year`, `monthly_allowance_baseline`, `savings_goal`, `avatar`) VALUES
('user_alex', 'Alex Rivera', 'alex@campus.edu', 'password123', 'student', 'Junior (Computer Science B.S. \'27)', 680.00, 180.00, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'),
('user_admin', 'Campus Financial Admin', 'admin@campuscoin.com', 'admin123', 'admin', 'Student Affairs Office', 0.00, 0.00, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80');

-- ----------------------------------------------------------------------------
-- Table: categories
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `category_id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `type` ENUM('income', 'expense') NOT NULL,
  `is_default` TINYINT(1) DEFAULT 1,
  `icon` VARCHAR(50) DEFAULT 'Package',
  `color` VARCHAR(20) DEFAULT '#10b981',
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Categories
INSERT INTO `categories` (`category_id`, `name`, `type`, `is_default`, `icon`, `color`) VALUES
('inc_1', 'Allowance', 'income', 1, 'Wallet', '#10b981'),
('inc_2', 'Part-time Job', 'income', 1, 'Briefcase', '#06b6d4'),
('inc_3', 'Scholarship', 'income', 1, 'GraduationCap', '#8b5cf6'),
('inc_4', 'Gift & Cash', 'income', 1, 'Gift', '#ec4899'),
('inc_5', 'Other Income', 'income', 1, 'Coins', '#f59e0b'),
('exp_1', 'Food & Dining', 'expense', 1, 'Utensils', '#ef4444'),
('exp_2', 'Campus Transport', 'expense', 1, 'Bus', '#06b6d4'),
('exp_3', 'Dorm & Rent', 'expense', 1, 'Home', '#3b82f6'),
('exp_4', 'Academics & Books', 'expense', 1, 'BookOpen', '#8b5cf6'),
('exp_5', 'Digital Subscriptions', 'expense', 1, 'Tv', '#a855f7'),
('exp_6', 'Social & Outings', 'expense', 1, 'Film', '#f59e0b'),
('exp_7', 'Miscellaneous', 'expense', 1, 'Package', '#64748b');

-- ----------------------------------------------------------------------------
-- Table: transactions
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `transactions`;
CREATE TABLE `transactions` (
  `transaction_id` VARCHAR(50) NOT NULL,
  `user_id` VARCHAR(50) NOT NULL,
  `category_id` VARCHAR(50) NOT NULL,
  `type` ENUM('income', 'expense') NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `date` DATE NOT NULL,
  `recurring` TINYINT(1) DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`transaction_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`category_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Transactions
INSERT INTO `transactions` (`transaction_id`, `user_id`, `category_id`, `type`, `amount`, `description`, `date`, `recurring`) VALUES
('tx_1', 'user_alex', 'inc_1', 'income', 550.00, 'Monthly Family Allowance', '2026-09-25', 1),
('tx_2', 'user_alex', 'inc_2', 'income', 240.00, 'CS Lab Peer Tutor Stipend', '2026-09-18', 0),
('tx_3', 'user_alex', 'inc_4', 'income', 60.00, 'Grandma Birthday Gift', '2026-09-12', 0),
('tx_4', 'user_alex', 'exp_1', 'expense', 38.50, 'Campus Center Cafe & Grill', '2026-09-26', 0),
('tx_5', 'user_alex', 'exp_1', 'expense', 92.40, 'Weekly Groceries at Trader Joe\'s', '2026-09-24', 0),
('tx_6', 'user_alex', 'exp_2', 'expense', 35.00, 'Monthly Campus Subway Pass', '2026-09-25', 1),
('tx_7', 'user_alex', 'exp_3', 'expense', 260.00, 'Quad Dorm Room Rent Share', '2026-09-26', 1),
('tx_8', 'user_alex', 'exp_4', 'expense', 74.99, 'Algorithms & AI Specialization Textbook', '2026-09-21', 0),
('tx_9', 'user_alex', 'exp_5', 'expense', 14.99, 'Spotify & Hulu Student Duo Bundle', '2026-09-17', 1),
('tx_10', 'user_alex', 'exp_6', 'expense', 28.00, 'Friday IMAX Movie Ticket', '2026-09-20', 0);

-- ----------------------------------------------------------------------------
-- Table: budgets
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `budgets`;
CREATE TABLE `budgets` (
  `budget_id` VARCHAR(50) NOT NULL,
  `user_id` VARCHAR(50) NOT NULL,
  `category_id` VARCHAR(50) NOT NULL,
  `limit_amount` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`budget_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`category_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Budgets
INSERT INTO `budgets` (`budget_id`, `user_id`, `category_id`, `limit_amount`) VALUES
('b_1', 'user_alex', 'exp_1', 200.00),
('b_2', 'user_alex', 'exp_2', 50.00),
('b_3', 'user_alex', 'exp_3', 260.00),
('b_4', 'user_alex', 'exp_4', 120.00),
('b_5', 'user_alex', 'exp_5', 25.00),
('b_6', 'user_alex', 'exp_6', 60.00);

-- ----------------------------------------------------------------------------
-- Table: announcements
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `announcements`;
CREATE TABLE `announcements` (
  `announcement_id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `text` TEXT NOT NULL,
  `date` DATE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `announcements` (`title`, `text`, `date`) VALUES
('Campus Financial Aid Deadline', 'Spring semester scholarship applications close October 15th.', '2026-09-20'),
('Student Budgeting Workshop', 'Join the Student Financial Literacy Club this Thursday at 5 PM in Union Room 204.', '2026-09-15');
