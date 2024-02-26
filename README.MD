# IMS - Inventory Management System

Simple inventory management system web application based on *express and postgresql.*

Features:

**Register New Item**
 - Register item detail (Item Name, Category, Brand, UOM, Spec)
 - Auto generate item ID in postgresql
 - Display confirmation message after item has been successfully registered


**Check Item Details**
 - Search by Item ID, Item Name, Category, Brand and Spec
 - Allowed combination of search criteria
 - If no input, will display "No record found!"
 - if search criteria not found, will display "No record found!"
 - Display item details included Item ID, Item Name, Category, Brand and Spec

**Check Stock Card**
 - Search by Start Date, End Date, Item ID, Item Name and Brand
 - Stock card will display transaction record, including Transaction Date, Item ID, Item Name, Brand, Transaction Type, Stock In Qty, Stock Out Qty, Stock Balance Qty, UOM
 - Print function which only print the transaction record and omit the non relevant HTML element (such as Navibar etc)

**Perform Stock Transaction**
 - Query item by Item ID, Item Name or Brand
 - Display list of item which matched the search criteria, select particular item to perform transaction
 - 3 type transaction type :
 - Stock in: allowed to key in Stock in Qty
 - Stock out: allowed to key in Stock out Qty
 - Adjustment: Allowed to key in both Stock in Qty and Stock out Qty
 - Once submit the transaction, postgresql will auto record the timestamp, a confirmation page will display " You have successfully updated the entry!" along with relevant transaction record

## Setup IMS in your environment
1. Use the SQL command in CreateDB.sql to create the postgresql DB table.
2. Create an .env file with your postgresql setting :

    ```
    DB_USER=??????  
    DB_PASSWORD=??????  
    DB_HOST=??????  
    DB_PORT=?????? 
    DB_DATABASE=Your DB Name
    ```

3. If you do not want to put the postgresql setting in .env, you can straight edit the postgresql setting in index.js, line 12:

    ```
    const  db  =  new pg.Client({
    user: ??????,
    host: ??????,
    database: Your DB Name,
    password: ??????,
    port: ??????,
    });
    db.connect();
    ```



4. Run the index.js and server will run on port http://localhost:3000

## Feedback issue and contact
email: wengkiadyap@gmail.com