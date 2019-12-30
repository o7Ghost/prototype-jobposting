const express = require("express");
const app = express();
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user:'fruitboy', //db user name
    password:'Aa745892475', //db password
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
    response.redirect("/jobpost/1")
});

app.get("/job/:jobId", function (req, res) {
    connection.query("SELECT * FROM company_posts WHERE Company_id = ' " + req.params.jobId + "'", (err, rows, fields)=>{
        if(err){
            console.log(err);
        }
        else{
            res.send(rows[0]);
        }
    })
})

app.get('/jobpost/:pageIndex', (request, response) => {
    connection.query('SELECT * FROM company_posts', (err, rows, fields)=>{
        if(!err){
            var pageIndex = parseInt(request.params.pageIndex);
            var total_page_length = Math.ceil(rows.length / 10);
            var pagin_per_page = 5;
            var start = (pageIndex - 1) * pagin_per_page;
            var end = start + 10;
            var pagin_start = pageIndex - 2;
            var pagin_end = pageIndex + 3;

            //edge cases for first few pages and last few pages
            if(pagin_start < 1){
                pagin_start = 1;
                pagin_end = pagin_start + 5;
            }
            if(pagin_end > total_page_length){
                pagin_end = total_page_length;
                pagin_start = pagin_end - 5;
            }
            response.render('index', {all_posts: rows, start: start, end: end, pagin_start: pagin_start, pagin_end: pagin_end, last_page: total_page_length - 1, currPage: pageIndex});
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