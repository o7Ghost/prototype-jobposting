let Company_names = new Set()
var singleData

const fs = require('fs')

try {
  const data = fs.readFileSync('jobdata.json', 'utf8')
  singleData = JSON.parse(data);
  for (var i = 12; i < 532; i++) {
    Company_names.add(singleData[i]['fields']['job_title'])
  }
} catch (err) {
  console.error(err)
}

var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',     // your root username
  password : 'Id00010469',
  database : 'Posting_Web',   // the name of your db
  multipleStatements: true
});

var Company_Acc = []

for (let num of Company_names) {

	Company_Acc.push([num, '123'])
}

var create_check_db = 'CREATE DATABASE IF NOT EXISTS Posting_Web;use Posting_Web;'

connection.query(create_check_db, function(err, result) {
  if (err) throw err;
  //console.log(result);
});

var table_names = []
table_names.push(['BookMark'])
table_names.push(['Company_Posts'])
table_names.push(['User'])
table_names.push(['Company_Acc'])
var check_table_exists = 'DROP TABLE IF EXISTS'
var create_company_Acc_table = 'create table Company_Acc (Company_Accid int auto_increment primary key,Company_name varchar(255) not null,Password varchar(255) not null);'
var create_user_Acc_table = 'create table User (User_id int auto_increment primary key,UserName varchar(255) not null,Password varchar(255) not null);'
var create_company_post_table = 'create table Company_Posts (Company_id INT auto_increment primary key,Company_Name varchar(255) not null,Location varchar(255) not null,Job_Title varchar(255) not null,Context text not null,Job_Link varchar(255) not null,Company_Acc_id int,FOREIGN KEY(Company_Acc_id) References Company_Acc(Company_Accid) on delete cascade)'
var create_Book_mark_table = 'Create table BookMark (CompanyId int,FOREIGN KEY(CompanyId) References Company_Acc(Company_Accid) on delete cascade,userID int,FOREIGN KEY(userID) References User(User_id) on delete cascade);'
var create_table_statements = []
create_table_statements.push(create_company_Acc_table)
create_table_statements.push(create_user_Acc_table)
create_table_statements.push(create_company_post_table)
create_table_statements.push(create_Book_mark_table)

connection.query(check_table_exists + " " + [table_names], function(err, result) {
	if (err) throw err;
	//console.log(result);
	});

for (var i = 0; i < create_table_statements.length; i++) {
connection.query(create_table_statements[i], function(err, result) {
	if (err) throw err;
	//console.log(result);
	});
}

var Company_Acc_insert = 'INSERT INTO Company_Acc (Company_name, Password) VALUES ?';

connection.query(Company_Acc_insert, [Company_Acc], function(err, result) {
	if (err) throw err;
	//console.log(result);
	});

var Company_Post_Insert = 'INSERT INTO Company_Posts (Company_Name, Location, Job_Title, Context, Job_Link, Company_Acc_id) VALUES ?'
var Company_Post_Values = []


for (var i = 12; i < 532; i++) {

	var Company_N = singleData[i]['fields']['job_title']
    var Company_L = singleData[i]['fields']['job_location']
    var Company_JT = singleData[i]['fields']['company_name']
    var C = singleData[i]['fields']['post_html_body']
    var JL = singleData[i]['fields']['job_apply_link']
	
    if (Company_N != 'Jampp') {
		Company_Post_Values.push([Company_N, Company_L, Company_JT, C,JL,null])
	}
	
}

connection.query(Company_Post_Insert, [Company_Post_Values], function(err, result) {
  if (err) throw err;
});


var q = 'update Company_Posts, Company_Acc set Company_Posts.Company_Acc_id = Company_Acc.Company_Accid where Company_Posts.Company_Name = Company_Acc.Company_name;'
connection.query(q, function(err, result) {
	if (err) throw err;
});

//select Company_Posts.Company_Name as name, Company_Acc_id from Company_Posts inner join Company_Acc on Company_Posts.Company_Name = Company_Acc.Company_name;
// select Company_Acc_id from Company_Posts inner_join Company_Acc where Company_Posts.Company_name = Company_Acc.UserName
// var stuff = 'select Company_Accid from Company_Acc where Company_name = ?'
//   connection.query(stuff, Company_N, function(err, result) {
// 		if (err) throw err;
// 			return result[0].Company_Accid;
// 	});

connection.end();