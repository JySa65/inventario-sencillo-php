-- Add migration script here
-- Asegurar default
ALTER TABLE items ALTER COLUMN description SET DEFAULT '';

-- Rellenar posibles NULL existentes
UPDATE items SET description = '' WHERE description IS NULL;

-- Forzar NOT NULL
ALTER TABLE items ALTER COLUMN description SET NOT NULL;
