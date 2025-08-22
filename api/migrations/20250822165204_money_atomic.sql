-- Monedas con su escala (minor units)
CREATE TABLE IF NOT EXISTS currencies (
  code TEXT PRIMARY KEY,
  scale SMALLINT NOT NULL CHECK (scale >= 0 AND scale <= 9)
);

INSERT INTO currencies (code, scale) VALUES
  ('USD', 2),
  ('EUR', 2),
  ('VES', 2),
  ('JPY', 0)
ON CONFLICT (code) DO NOTHING;

-- Items: pasar de cents a atomic
ALTER TABLE items ADD COLUMN price_atomic BIGINT NOT NULL DEFAULT 0;
ALTER TABLE items ADD COLUMN currency_code TEXT NOT NULL DEFAULT 'USD'
  REFERENCES currencies(code);

-- Si venías usando price_cents previamente:
UPDATE items SET price_atomic = price_cents; -- asumiendo que eran cents (scale=2)

-- Limpiar columna vieja
ALTER TABLE items DROP COLUMN price_cents;

-- Movimientos: capturar valuación
ALTER TABLE stock_movements
  ADD COLUMN unit_price_atomic BIGINT,
  ADD COLUMN currency_code TEXT REFERENCES currencies(code),
  ADD COLUMN total_atomic BIGINT;
