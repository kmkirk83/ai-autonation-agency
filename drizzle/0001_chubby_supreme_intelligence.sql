CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`businessName` varchar(255) NOT NULL,
	`contactName` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`serviceInterest` enum('AI Voice Receptionist','Lead Reactivation Bot','Customer Support Automation') NOT NULL,
	`status` enum('New','Contacted','Closed') NOT NULL DEFAULT 'New',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `outreachAssets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`businessName` varchar(255) NOT NULL,
	`niche` varchar(255) NOT NULL,
	`coldEmail` text NOT NULL,
	`loomScript` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `outreachAssets_id` PRIMARY KEY(`id`)
);
