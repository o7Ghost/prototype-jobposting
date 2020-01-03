var express = require('express');
var mysql = require('mysql');

//var app = express();
var router = express.Router();
//app.set("view engine", "ejs");
var bodyParser = require("body-parser");
const { check, validationResult } = require('express-validator');
const { body } = require('express-validator');
router.use(bodyParser.urlencoded({extended: true}));


router.get("/", function(req, res){
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;