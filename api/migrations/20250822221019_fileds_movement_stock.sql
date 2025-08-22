-- Add migration script here
ALTER TABLE stock_movements
ADD COLUMN previous_quantity NUMERIC(18,3) NOT NULL DEFAULT 0,
ADD COLUMN new_quantity      NUMERIC(18,3) NOT NULL DEFAULT 0;
