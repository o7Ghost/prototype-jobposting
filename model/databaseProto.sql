CREATE DATABASE IF NOT EXISTS Posting_Web;
use Posting_Web;

Create table Company_Acc (
	Company_Accid int auto_increment primary key,
	Company_name varchar(255) not null,
	Password varchar(255) not null
);

Create table User (
	User_id int auto_increment primary key,
	UserName varchar(255) not null,
	Password varchar(255) not null
);


Create table Company_Posts (
	Company_id INT auto_increment primary key,
	Company_Name varchar(255) not null,
	Location varchar(255) not null,
	Job_Title varchar(255) not null,
	Context varchar(255) not null,
	Job_Link varchar(255) not null,
	Company_Acc_id int,
	FOREIGN KEY(Company_Acc_id) References Company_Acc(Company_Accid) on delete cascade
);

Create table BookMark (
	CompanyId int,
	FOREIGN KEY(CompanyId) References Company_Posts(Company_id) on delete cascade,
	userID int,
	FOREIGN KEY(userID) References User(User_id) on delete cascade

)
