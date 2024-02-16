import express from "express";
import 'dotenv/config'; 
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));
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
    var currentdate = new Date();
  res.render("index.ejs", {todayDate: currentdate});
});

app.get("/itemdetails", (req, res) => {
    res.render("itemdetails.ejs");
});

app.post("/itemdetails", async (req, res) => {
    
    // if no input, will not return all result
    if ( (!req.body.itemid) && (!req.body.itemname) && (!req.body.category) && (!req.body.brand) && (!req.body.spec) ){
      res.render("displaydetails.ejs");
      return;
    }

    if (req.body.itemid) { var id = `id = ${req.body.itemid} AND ` }
        else {var id = ``};
    if (req.body.itemname) { var name = `name LIKE '%${req.body.itemname}%' AND ` }
        else {var name = `name LIKE '%' AND `};
    if (req.body.category) { var category = `category LIKE '%${req.body.category}%' AND ` }
        else {var category = `category LIKE '%' AND `};
    if (req.body.brand) { var brand = `brand LIKE '%${req.body.brand}%' AND ` }
        else {var brand = `brand LIKE '%' AND `};
    if (req.body.spec) { var spec = `spec LIKE '%${req.body.spec}%'` } 
        else {var spec = `spec LIKE '%'`} ;

    const enquiry = id + name + category + brand + spec;
    console.log(enquiry);

    try {
      // const result = await db.query("SELECT * FROM item_details WHERE id = 1 AND name LIKE '%pencil%' ");
      const result = await db.query(`SELECT * FROM item_details WHERE ${enquiry}`);
      let itemdetails = result.rows[0];
      res.render("displaydetails.ejs", {entries:itemdetails});
      
    } catch (error) {
      console.log(error); 
    }
    
});

app.get("/stockcard", (req, res) => {
  res.render("stockcard.ejs");
});

app.get("/stockcard", (req, res) => {
    // should return enquiry from DB
    res.render("stockcard.ejs");
  });
  

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
