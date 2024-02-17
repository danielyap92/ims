CREATE TABLE item_details (
  id SERIAL PRIMARY KEY,
  name TEXT,
  category TEXT,
  brand TEXT,
  uom VARCHAR(12),
  spec TEXT
);

INSERT INTO item_details (name, category, brand, uom, spec)
VALUES ('2B pencil', 'pencil', 'brand A', 'pcs','7" hexagon 2B pencil');

-- shall create record for stock_quantity and stock_card as well

CREATE TABLE stock_quantity (
  id INTEGER REFERENCES item_details(id) UNIQUE,
  qty INTEGER,
  minimum_level INTEGER,
  maximum_level INTEGER,
  storage_location TEXT
);


INSERT INTO stock_quantity (id, qty, minimum_level, maximum_level, storage_location)
VALUES (1, 15, 10, 999, 'Rack A-1');

UPDATE stock_quantity SET (qty, minimum_level, maximum_level, storage_location) = (150, 20, 200, 'Rack A-1') WHERE id = 1 ;

CREATE TABLE stock_card (
  trasanction_id SERIAL PRIMARY KEY,
  item_id INTEGER REFERENCES item_details(id),
  transaction_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  type TEXT NOT NULL,
  stock_in INTEGER,
  stock_out INTEGER,
  stock_balance INTEGER
);

-- use insert method for stock card
INSERT INTO stock_card (item_id, type)
VALUES (1, 'Created stock card');

INSERT INTO stock_card (item_id, type, stock_in)
VALUES (1, 'stock in', 100);

INSERT INTO stock_card (item_id, type, stock_out)
VALUES (1, 'stock out', 50);

INSERT INTO stock_card (item_id, type, stock_balance)
VALUES (2, 'Created stock card', 0);

-- query stock card
SELECT * FROM stock_card
JOIN item_details ON stock_card.item_id = item_details.id
WHERE item_details.id = 1
AND stock_card.transaction_time BETWEEN '%2024-01-01%' AND '%2024-12-31%'
AND item_details.name LIKE '%'
AND item_details.brand LIKE '%'
ORDER BY transaction_time

SELECT stock_balance FROM stock_card
WHERE item_id = 1
ORDER BY transaction_time DESC
LIMIT 1;