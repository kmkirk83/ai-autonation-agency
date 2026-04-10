CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`stripePaymentIntentId` varchar(255) NOT NULL,
	`stripeCheckoutSessionId` varchar(255),
	`amount` int NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'usd',
	`status` enum('pending','completed','failed','canceled') NOT NULL DEFAULT 'pending',
	`items` text NOT NULL,
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`),
	CONSTRAINT `orders_stripePaymentIntentId_unique` UNIQUE(`stripePaymentIntentId`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`stripeSubscriptionId` varchar(255) NOT NULL,
	`stripePriceId` varchar(255) NOT NULL,
	`status` enum('active','paused','canceled','past_due') NOT NULL DEFAULT 'active',
	`currentPeriodStart` timestamp,
	`currentPeriodEnd` timestamp,
	`canceledAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `subscriptions_stripeSubscriptionId_unique` UNIQUE(`stripeSubscriptionId`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `stripeCustomerId` varchar(255);