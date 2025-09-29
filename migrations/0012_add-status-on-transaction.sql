-- Migration number: 0012 	 2025-09-29T02:12:20.542Z

ALTER TABLE transactions ADD COLUMN status TEXT NOT NULL DEFAULT "pending";
