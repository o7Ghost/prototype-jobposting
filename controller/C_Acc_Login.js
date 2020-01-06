var express = require('express');
var mysql = require('mysql');
var router = express.Router();
const session = require("express-session")
var bodyParser = require("body-parser");
const {check, validationResult} = require('express-validator');
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.urlencoded({
    extended: true
}))

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // your root username
    password: 'fruitboy',
    database: 'Aa745892475', // the name of your db
    multipleStatements: true
});

router.get('/data/:Id', (request,res) => {
	var q = "select * from Company_Posts where Company_id = ?"
	connection.query(q, request.params.Id, (err,result) => {
		res.send(result[0]);
	});
});

router.get('/', (request,res) => {
	console.log("company page");
	var q = "select * from Company_Posts where Company_Acc_id = ?"
	connection.query(q, request.session.userId, (err,result) => {
		res.render('C_login_p', {result:result});
	});
});

module.exports = router;