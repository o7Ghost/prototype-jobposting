const express = require("express");
const session = require("express-session")
const bodyParser = require("body-parser")
const idCheck = require("./middle_ware/redirectLogin")
const app = express();
var mysql = require('mysql');

app.use(bodyParser.urlencoded({
    extended: true
}))

//setting up session 
const {
    PORT = 8000,
        NODE_ENV = 'development',
        SESS_SECRET = "whateverman\e\e\e"
} = process.env

const IN_PRODUCTION = NODE_ENV === 'production'
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: SESS_SECRET,
    cookie: {
        secure: IN_PRODUCTION
    }
}))

// order matters place routes after session to have access to session within those routes
app.use('/Login', require('./controller/signIn'));
app.use('/SignUp', require('./controller/register'));
app.use('/LogOut', require('./controller/logout'));



//Tells the server to look for static files from a folder called "static" from root
app.use(express.static(__dirname + "/static"));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


//setting up database connection
var connection = mysql.createConnection({
    host: 'localhost',
    user: '', // your root username
    password: '',
    database: 'Posting_Web', // the name of your db
    multipleStatements: true
});

connection.connect(function (error) {
    if (error) {
        console.log(error);
        console.log('database errors');
    } else {
        console.log('connected');
    }
});




app.get('/', (request, response) => {
    response.redirect("/jobpost/1")
});

app.get("/job/:jobId", function (req, res) {
    connection.query("SELECT * FROM company_posts WHERE Company_id = ' " + req.params.jobId + "'", (err, rows, fields) => {
        if (err) {
            console.log(err);
        }
        //sending json 
        else {
            res.send(rows[0]);
        }
    })
})

app.get('/jobpost/:pageIndex', (request, response) => {
    connection.query('SELECT * FROM company_posts', (err, rows, fields) => {
        if (!err) {
            var pageIndex = parseInt(request.params.pageIndex);
            var total_page_length = Math.ceil(rows.length / 10);
            var pagin_per_page = 5;
            var start = (pageIndex - 1) * pagin_per_page;
            var end = start + 10;
            var pagin_start = pageIndex - 2;
            var pagin_end = pageIndex + 3;

            //edge cases for first few pages and last few pages
            if (pagin_start < 1) {
                pagin_start = 1;
                pagin_end = pagin_start + 5;
            }
            if (pagin_end > total_page_length) {
                pagin_end = total_page_length;
                pagin_start = pagin_end - 5;
            }
            if (request.session.userId) {
                connection.query('SELECT * FROM user WHERE User_id = ' + request.session.userId, (err, r, fields) => {
                    if (!err) {
                        response.render('index', {
                            all_posts: rows,
                            start: start,
                            end: end,
                            pagin_start: pagin_start,
                            pagin_end: pagin_end,
                            last_page: total_page_length - 1,
                            currPage: pageIndex,
                            currUser: r[0].UserName,
                            session: request.session
                        });
                    } else {
                        console.log(err);
                    }
                })
            } else {
                response.render('index', {
                    all_posts: rows,
                    start: start,
                    end: end,
                    pagin_start: pagin_start,
                    pagin_end: pagin_end,
                    last_page: total_page_length - 1,
                    currPage: pageIndex,
                    currUser: "",
                    session: request.session
                });
            }
        } else {
            console.log(err);
        }
    })
});

app.get("/users", (req, res) => {
    // hard-coded user data
    var users_array = [{
            name: "Michael",
            email: "michael@codingdojo.com"
        },
        {
            name: "Jay",
            email: "jay@codingdojo.com"
        },
        {
            name: "Brendan",
            email: "brendan@codingdojo.com"
        },
        {
            name: "Andrew",
            email: "andrew@codingdojo.com"
        }
    ];
    res.render('users', {
        users: users_array
    });
})
app.listen(PORT, () => console.log("listening on port" + PORT));