-- Migration number: 0013 	 2025-09-29T07:19:55.648Z

ALTER TABLE keychains RENAME COLUMN stripe_link TO stripe_price_id;
