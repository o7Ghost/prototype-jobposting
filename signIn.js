var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var bodyParser = require("body-parser");
const {check, validationResult} = require('express-validator');
router.use(bodyParser.urlencoded({extended: true}));

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : '',     // your root username
  password : '',
  database : 'Posting_Web',   // the name of your db
  multipleStatements: true
});

router.post("/", function(req,res) {
	console.log("step 1");
	var q = "select UserName from user where UserName = ?"
	connection.query(q, req.body.Username, function(err, result){
		if (err) throw err;
		if (result.length > 0) {
			console.log("User Sucess");
			var v = "select Password from user where UserName = ?"
			connection.query(v, req.body.Username, function(er, re) {
				if (err) throw err;
				if (re[0].Password === req.body.Password) {
					console.log("Sucessful Login");
					res.redirect('/jobpost/1');
				}
				else {
					res.render('login', {error: "Incorrect Password"});
				}
			});
		}
		else {
			res.render('login', {error: "Incorrect UserName"});
		}
	});
});

router.get("/", function(req,res) {
	res.render('login', {error: ""});
});

module.exports = router;