var express = require('express');
var mysql = require('mysql');
//var app = express();
var router = express.Router();
//app.set("view engine", "ejs");
var bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
router.use(bodyParser.urlencoded({extended: true}));

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : '',     // your root username
  password : '',
  database : 'Posting_Web',   // the name of your db
  multipleStatements: true
});

const { body } = require('express-validator');

router.post("/", [check('Username').isEmail().withMessage('Invalid Email'), 
	check('Password').isLength({ min: 5 }).withMessage('must be at least 5 chars long'),
	check('Password', "Your password must contain at least one:" + 
		   "Uppercase character, Lowercase character, Symbol and Numeric character").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/),
	body('Password2').custom((value, {req}) => {
		if (value !== req.body.Password) {
    		throw new Error('Password confirmation does not match password');
  		}
  		return true;
	})], 
	function(req, res) {
	var err = validationResult(req);
	
	if (!err.isEmpty()) {
		console.log("error");
		err = err.array();
		res.render('signUp', {errors : err});
  	}
  	else {
  		var q = 'insert into User (UserName, Password) values ?';
  		var tmp = [];
  		tmp.push([req.body.Username, req.body.Password]);
  		
  		connection.query(q, [tmp], function(err, result) {
  			if (err) throw err;
  			console.log("REGISTERED")
  			res.redirect('/Login');
  		});
  		
  	}
	
});

router.get("/", function(req, res){
 	res.render('signUp', {errors:[]});
});

module.exports = router;