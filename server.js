var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");

var app = express();
var port = 3011;

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// Set up body-parser middleware to parse form and json data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Override with POST having ?_method=DELETE
app.use(methodOverride("_method"));
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "quotes_db"
});

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

// Express and MySQL code should go here.

//get all quotes in db

app.get("/", function(req, res){
  connection.query("select * from quotes;", function(err, data){
    if (err){
      throw err;
    }

    res.render("index", {quotes: data});

  });
});

//delete a single quote from quotes in db

app.delete("/:id", function(req, res){
  connection.query("delete from quotes where id = ?", [req.params.id], function(err, result){
    if (err){
      throw err;
    }
    res.redirect("/");
  });
});

//enter a single quote into db

app.post("/", function(req, res){
  connection.query("insert into quotes (author, quote) values (?, ?)", [req.body.author, req.body.quote], function(err, result){
    if (err){
      throw err;
    }
    res.redirect("/");
  });
});

app.put("/:id", function(req, res){
  connection.query("update quotes set author = ?, quote = ? where id = ? ", [req.body.author, req.body.quote, req.params.id], function(err, result){
    if (err) {
      throw err;
    }
    res.redirect("/");
  });
});

app.get("/:id", function(req, res){
  connection.query("select * from quotes where id = ?", [req.params.id], function(err, data){
    if (err){
      throw err;
    }
    res.render("single_quote", data[0])
  });
});

app.listen(port, function() {
  console.log("Listening on PORT " + port);
});
