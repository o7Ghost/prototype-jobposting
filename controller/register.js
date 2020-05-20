var express = require('express');
var mysql = require('mysql');

//var app = express();
var router = express.Router();
//app.set("view engine", "ejs");
var bodyParser = require("body-parser");
const {
	check,
	validationResult
} = require('express-validator');
const {
	body
} = require('express-validator');
router.use(bodyParser.urlencoded({
	extended: true
}));

//setting up database connection
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // your root username
    password: 'Id00010469',
    database: 'Posting_Web', // the name of your db
    multipleStatements: true
});


function findUserByEmail(value){
	return new Promise(function(resolve, reject){
		const e = "select UserName from User where UserName = ?; select Company_name from Company_Acc where Company_name = ?;"
		//const e = "select UserName from User where UserName = ?";
		connection.query(e, [value,value], function(err, result){
			if(err) throw err;
			if(result[0].length != 0 || result[1].length != 0){
				return resolve(true);
			}
			else{
				return resolve(false);
			}
		});
	});
}

router.post("/", [check('Username').isEmail().withMessage('Invalid Email'),
		check('Password').isLength({
			min: 8
		}).withMessage('must be at least 5 chars long'),
		check('Password', "Your password must contain at least one:" +
			"Uppercase character, Lowercase character, Symbol and Numeric character").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/),
		body('Password2').custom((value, {
			req
		}) => {
			if (value !== req.body.Password) {
				throw new Error('Password confirmation does not match password');
			}
			return true;
		}),

		body('Username').custom(value=> {
			return findUserByEmail(value).then(user => {
				if(user){
					return Promise.reject('E-mail alreay in use');
				}
				else{
					return true;
				}
			})
		})
	],
	function (req, res) {
		var err = validationResult(req);

		if (!err.isEmpty()) {
			console.log("error");
			err = err.array();
			res.render('signUp', {
				errors: err
			});
		} else {

			var q = "";
			if (req.body.company == "true") {
				console.log("company_Acc inserted!");
				q = 'insert into Company_Acc (Company_name, Password) values ?';	
			}
			else {
				q = 'insert into User (UserName, Password) values ?';
			}
			
			var tmp = [];
			tmp.push([req.body.Username, req.body.Password]);

			connection.query(q, [tmp], function (err, result) {
				if (err) throw err;
				console.log("REGISTERED")
				res.redirect('/Login');
			});
		}
	});

router.get("/", function (req, res) {
	res.render('signUp', {
		errors: []
	});
});

module.exports = router;