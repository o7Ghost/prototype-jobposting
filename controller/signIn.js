var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var bodyParser = require("body-parser");
const {check, validationResult} = require('express-validator');
router.use(bodyParser.urlencoded({extended: true}));

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'fruitboy',     // your root username
  password : 'Aa745892475',
  database : 'posting_Web',   // the name of your db
  multipleStatements: true
});

router.post("/", function(req,res) {
	console.log("step 1");

	var q = ""
	if (req.body.company == "true") {
		q = "select Company_name from Company_Acc where Company_name = ?";
	}
	else {
		q = "select UserName from user where UserName = ?";
	}

	connection.query(q, req.body.Username, function(err, result){
		if (err) throw err;
		if (result.length > 0) {
			console.log("User Success");

			var v = "";
			if (req.body.company == "true") {
				v = "select Password, Company_Accid from Company_Acc where Company_name = ?";
			}
			else {
				v = "select Password,User_id from user where UserName = ?"
			}

			connection.query(v, req.body.Username, function(er, re) {
				if (err) throw err;
				console.log(req.body.Password)
				console.log(re[0].Password)
				if (re[0].Password === req.body.Password) {
					console.log("Sucessful Login");
					// console.log(re[0].User_id)
					// console.log(req.session)
					if (req.body.company == "true") {
						req.session.userId = re[0].Company_Accid;
						router.use('/acc_page', require('../controller/C_Acc_Login'));
						res.redirect('/Login/acc_page');
					}
					else {
						req.session.userId = re[0].User_id;
						res.redirect('/');
					}	
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