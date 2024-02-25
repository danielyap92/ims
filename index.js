import express from "express";
import "dotenv/config";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
db.connect();

app.get("/", (req, res) => {
  var currentdate = new Date().toLocaleString().split(",")[0];
  res.render("index.ejs", { todayDate: currentdate });
});

app.get("/registerItem", (req, res) => {
  res.render("registerItem.ejs");
});

app.post("/registerItem", async (req, res) => {
  try {
    const result = await db.query(
      `INSERT INTO item_details (name, category, brand, uom, spec)
    VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [
        req.body.itemname,
        req.body.category,
        req.body.brand,
        req.body.uom,
        req.body.spec,
      ]
    );

    try {
      db.query(
        `INSERT INTO stock_card (item_id, type, stock_balance)
        VALUES ($1, 'Created stock card', 0);`,
        [result.rows[0].id]
      );
    } catch (error) {
      console.log(error);
    }

    res.render("displaydetails.ejs", {
      entries: result.rows,
      message: "Item has been registered!",
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/itemdetails", (req, res) => {
  res.render("itemdetails.ejs");
});

app.post("/itemdetails", async (req, res) => {
  // if no input, will not return all result
  if (
    !req.body.itemid &&
    !req.body.itemname &&
    !req.body.category &&
    !req.body.brand &&
    !req.body.spec
  ) {
    res.render("displaydetails.ejs");
    return;
  }

  if (req.body.itemid) {
    var id = `id = ${req.body.itemid} AND `;
  } else {
    var id = ``;
  }
  if (req.body.itemname) {
    var name = `name ILIKE '%${req.body.itemname}%' AND `;
  } else {
    var name = `name LIKE '%' AND `;
  }
  if (req.body.category) {
    var category = `category ILIKE '%${req.body.category}%' AND `;
  } else {
    var category = `category LIKE '%' AND `;
  }
  if (req.body.brand) {
    var brand = `brand ILIKE '%${req.body.brand}%' AND `;
  } else {
    var brand = `brand LIKE '%' AND `;
  }
  if (req.body.spec) {
    var spec = `spec ILIKE '%${req.body.spec}%'`;
  } else {
    var spec = `spec LIKE '%'`;
  }

  const enquiry = id + name + category + brand + spec;

  let itemdetails = [];

  try {
    const result = await db.query(
      `SELECT * FROM item_details WHERE ${enquiry}`
    );
    result.rows.forEach((x) => {
      itemdetails.push(x);
    });
    if (result.rows.length !== 0) {
      res.render("displaydetails.ejs", { entries: itemdetails });
    } else {
      res.render("displaydetails.ejs");
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/stockcard", (req, res) => {
  res.render("stockcard.ejs");
});

app.post("/stockcard", async (req, res) => {
  let year = new Date().getFullYear();

  // if no input, will not return all result
  if (
    !req.body.itemid &&
    !req.body.startdate &&
    !req.body.enddate &&
    !req.body.itemname &&
    !req.body.brand
  ) {
    res.render("stockcardDetails.ejs");
    return;
  }

  if (req.body.itemid) {
    var id = `item_details.id = ${req.body.itemid} AND `;
  } else {
    var id = ``;
  }
  if (req.body.startdate) {
    var startdate = `stock_card.transaction_time BETWEEN '%${req.body.startdate}%' AND `;
  } else {
    var startdate = `stock_card.transaction_time BETWEEN '%${year}-01-01%' AND `;
  }
  if (req.body.enddate) {
    var enddate = `'%${req.body.enddate}%' AND `;
  } else {
    var enddate = `'%${year}-12-31%' AND `;
  }
  if (req.body.itemname) {
    var name = `item_details.name ILIKE '%${req.body.itemname}%' AND `;
  } else {
    var name = `item_details.name LIKE '%' AND `;
  }
  if (req.body.brand) {
    var brand = `item_details.brand ILIKE '%${req.body.brand}%'`;
  } else {
    var brand = `item_details.brand LIKE '%'`;
  }

  let enquiry = id + startdate + enddate + name + brand;
  let stockcardDetails = [];

  try {
    let result = await db.query(`SELECT * FROM stock_card
      JOIN item_details ON stock_card.item_id = item_details.id
      WHERE ${enquiry} ORDER BY transaction_time`);

    result.rows.forEach((x) => {
      stockcardDetails.push(x);
    });
    if (result.rows.length !== 0) {
      res.render("stockcardDetails.ejs", { entries: stockcardDetails });
    } else {
      res.render("stockcardDetails.ejs");
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/stocktransc", (req, res) => {
  res.render("stocktransc.ejs");
});

app.post("/stocktransc", async (req, res) => {
  // if no input, will not return all result
  if (!req.body.itemid && !req.body.itemname && !req.body.brand) {
    res.render("stocktranscItem.ejs");
    return;
  }

  if (req.body.itemid) {
    var id = `id = ${req.body.itemid} AND `;
  } else {
    var id = ``;
  }
  if (req.body.itemname) {
    var name = `name ILIKE '%${req.body.itemname}%' AND `;
  } else {
    var name = `name LIKE '%' AND `;
  }
  if (req.body.brand) {
    var brand = `brand ILIKE '%${req.body.brand}%'`;
  } else {
    var brand = `brand LIKE '%'`;
  }

  const enquiry = id + name + brand;

  let itemdetails = [];

  try {
    const result = await db.query(
      `SELECT * FROM item_details WHERE ${enquiry}`
    );
    result.rows.forEach((x) => {
      itemdetails.push(x);
    });
    if (result.rows.length !== 0) {
      res.render("stocktranscItem.ejs", { entries: itemdetails });
    } else {
      res.render("stocktranscItem.ejs");
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/trscItem", async (req, res) => {
  const entry = await db.query(
    `SELECT * FROM item_details JOIN stock_card ON stock_card.item_id = item_details.id
  WHERE item_details.id = $1 ORDER BY transaction_time DESC LIMIT 1`,
    [req.body.id]
  );
  res.render("transaction.ejs", { entries: entry.rows[0] });
});

app.post("/transaction", async (req, res) => {
  //1. retrieve last stock balance
  let itemID = req.body.id;
  const balance = await db.query(
    `SELECT stock_balance FROM stock_card
  WHERE item_id = $1
  ORDER BY transaction_time DESC
  LIMIT 1;`,
    [itemID]
  );
  let stockBalance = Number(balance.rows[0].stock_balance);

  //2. use switch statement for three type transaction
  switch (req.body.type) {
    case "stockin":
      let stockInQty = Number(req.body.inqty);
      let addBalance = stockBalance + stockInQty;
      const inEntry = await db.query(
        `INSERT INTO stock_card (item_id, type, stock_in, stock_balance)
      VALUES ($1, 'stock in', $2, $3) RETURNING *;`,
        [itemID, stockInQty, addBalance]
      );
      res.render("updatedStockCard.ejs", { entries: inEntry.rows[0] });
      break;
    case "stockout":
      let stockOutQty = Number(req.body.outqty);
      let deductBalance = stockBalance - stockOutQty;
      const outEntry = await db.query(
        `INSERT INTO stock_card (item_id, type, stock_out, stock_balance)
      VALUES ($1, 'stock out', $2, $3) RETURNING *;`,
        [itemID, stockOutQty, deductBalance]
      );
      res.render("updatedStockCard.ejs", { entries: outEntry.rows[0] });
      break;
    case "adjustment":
      let adjIn = Number(req.body.inqty);
      let adjOut = Number(req.body.outqty);
      let updatedBalance = stockBalance + adjIn - adjOut;
      const adjEntry = await db.query(
        `INSERT INTO stock_card (item_id, type, stock_in, stock_out, stock_balance)
      VALUES ($1, 'adjustment', $2, $3, $4) RETURNING *;`,
        [itemID, adjIn, adjOut, updatedBalance]
      );
      res.render("updatedStockCard.ejs", { entries: adjEntry.rows[0] });
      break;
    default:
      console.log("error has occurred");
      break;
  }
});

app.get("/contact", (req, res) => {
  res.render("about.ejs");
})

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
