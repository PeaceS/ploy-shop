-- Migration number: 0003 	 2025-09-17T07:29:42.613Z

ALTER TABLE stock RENAME TO keychains;
ALTER TABLE `transaction` RENAME TO transactions;
