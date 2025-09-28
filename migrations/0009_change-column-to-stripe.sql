-- Migration number: 0009 	 2025-09-28T09:39:07.815Z

ALTER TABLE keychains RENAME COLUMN paypal_id TO stripe_link;
