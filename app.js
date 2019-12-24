const express = require("express");
const app = express();
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user:'', //db user name
    password:'', //db password
    database:'posting_web'
});

connection.connect(function(error){
    if(error){
        console.log(error);
        console.log('database errors');
    }
    else{
        console.log('connected');
    }
});

//Tells the server to look for static files from a folder called "static" from root
app.use(express.static(__dirname + "/static"));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/', (request, response) => {
    post_array = [];
    connection.query('SELECT * FROM company_posts', (err, rows, fields)=>{
        if(!err){
            response.render('index', {all_posts: rows});
        }
        else{
            console.log(err);
        }
    })
});

app.get("/users", (req, res) => {
    // hard-coded user data
    var users_array = [
        {name: "Michael", email: "michael@codingdojo.com"}, 
        {name: "Jay", email: "jay@codingdojo.com"}, 
        {name: "Brendan", email: "brendan@codingdojo.com"}, 
        {name: "Andrew", email: "andrew@codingdojo.com"}
    ];
    res.render('users', {users: users_array});
})
app.listen(8000, () => console.log("listening on port 8000"));