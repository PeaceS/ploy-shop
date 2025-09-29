-- Migration number: 0011 	 2025-09-29T01:52:46.475Z

ALTER TABLE transactions RENAME TO transactions_old;
CREATE TABLE transactions (
    uuid TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    product_type TEXT NOT NULL,
    product_id INTEGER NOT NULL,
    price INTEGER NOT NULL,
    purchased_at INTEGER NOT NULL,
    email TEXT
);
CREATE INDEX transaction_purchased_at ON transactions (purchased_at);
DROP TABLE transactions_old;
