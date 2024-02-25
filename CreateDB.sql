CREATE TABLE item_details (
  id SERIAL PRIMARY KEY,
  name TEXT,
  category TEXT,
  brand TEXT,
  uom VARCHAR(12),
  spec TEXT
);

CREATE TABLE stock_card (
  trasanction_id SERIAL PRIMARY KEY,
  item_id INTEGER REFERENCES item_details(id),
  transaction_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  type TEXT NOT NULL,
  stock_in INTEGER,
  stock_out INTEGER,
  stock_balance INTEGER
);