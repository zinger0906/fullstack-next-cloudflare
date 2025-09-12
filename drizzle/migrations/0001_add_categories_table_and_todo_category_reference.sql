CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`color` text DEFAULT '#6366f1',
	`description` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `todos` ADD `category_id` integer REFERENCES categories(id);