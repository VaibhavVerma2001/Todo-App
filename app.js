const express = require("express");
const bodyParser = require("body-parser");
const { urlencoded } = require("express");
const mongoose = require("mongoose");
const secret = require("secret");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// creating databse and connecting
// 1 - to host change url before DB name
// 2 - change password
// 3 - delete after .net to dbname
const password = secret.password;
var url = "mongodb+srv://vaibhav_verma:"+ password +"@cluster0.2dazz.mongodb.net/todoList";
mongoose.connect(url);


mongoose.connection
    .once('open', function () {
        console.log('Successfully connected to Database ...');
    })
    .on('error', function (err) {
        console.log(err);
});


// create schema
const itemsSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to Todo list"
});

const item2 = new Item({
    name: "Hit + button to add item"
});

const item3 = new Item({
    name: "Hit <-- button to delete the item"
});

const defaultItems = [item1, item2, item3];



app.get("/", (req, res) => {
    Item.find({}, function (err, items) {

        // since running app again and again will add defaultitems multiple times , so to solve this run insert function only once of our item collection is empty
        if (items.length === 0) {
            Item.insertMany(defaultItems , function(err) {
              if (err)
              {
                console.log(err);
              }
              else 
              {
                console.log("Successfully saved to todoList...")
              }
            });
            res.redirect("/"); //after inserting reload route
        }
        else 
        {
            res.render("list.ejs", { listTitle: "Today", newListItem: items });
        }
    });
});

app.post("/", (req, res) => {
    let itemName = req.body.newItem;

    //save new item to mongo
    const item1 = new Item({
        name : itemName
    });

    item1.save();
    res.redirect("/"); // redirect to home now
});

app.post("/delete" , (req,res)=>{
    // console.log(req.body); //{ checkbox: 'on' }
    //but if we provide value in checkbox it will return that , for example id 
    const checkedItemId = req.body.checkbox; 
    // console.log(checkedItemId); //id of item checked

    Item.deleteOne( {_id : checkedItemId} , function (err,res) {
        if(err) 
        {
          console.log(err);
        }
        else
        {
          console.log("Deleted item successfully ...");
        }
    } );
    res.redirect("/"); 
});



const port = process.env.PORT || 3000 ;
app.listen(port, function () {
    console.log("Server connected successfully...");
});
