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
  stock_out INTEGER
);

-- use insert method for stock card
INSERT INTO stock_card (item_id, type)
VALUES (1, 'Created stock card');

INSERT INTO stock_card (item_id, type, stock_in)
VALUES (1, 'stock in', 100);

INSERT INTO stock_card (item_id, type, stock_out)
VALUES (1, 'stock out', 50);

