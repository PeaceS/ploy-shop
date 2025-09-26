-- Migration number: 0008 	 2025-09-26T02:48:22.898Z

ALTER TABLE keychains ADD COLUMN categories_count INTEGER NOT NULL DEFAULT 1;
