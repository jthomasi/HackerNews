// URI string: mongodb://heroku_50bwhd1p:k5hme7n3a1d94nejev3jg1qh0g@ds155091.mlab.com:55091/heroku_50bwhd1p

// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var exphbs  = require('express-handlebars');
var mongoose = require("mongoose");

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Requiring our Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

// scraping tools
var request = require("request");
var cheerio = require("cheerio");

// Initialize Express
var app = express();
// add body-parser
app.use(bodyParser.urlencoded({
  extended: false
}));
// Making public a static dir
app.use(express.static("public"));

// add mongoose/heroku connection
mongoose.connect("mongodb://heroku_50bwhd1p:k5hme7n3a1d94nejev3jg1qh0g@ds155091.mlab.com:55091/heroku_50bwhd1p");
var db = mongoose.connection;

// if mongoose error occurs:
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// ROUTES: 

app.get("/scrape", function(req, res){

	request("https://news.ycombinator.com/", function(err, response, html){

		var $ = cheerio.load(html);

		$("td.title").each(function(i, element) {

			var result = {};

			var result.title = $(this).find("a.storylink").text();
			var result.newsLink = $(this).find("a.storylink").attr("href");

			if ( result.title == "" || result.title == null || result.newsLink == "" || result.newsLink == null) {
				return;
			}
			else {
				var entry = new Article(result);
			    entry.save(function(err, doc) {
			        // Log any errors
			        if (err) {
			          console.log(err);
			        }
			        // Or log the doc
			        else {
			          console.log(doc);
			        }
			    });
  			}	
		});
	});
	res.send("Scrape Complete");
});



app.listen(3000, function() {
  console.log("App running on port 3000!");
});