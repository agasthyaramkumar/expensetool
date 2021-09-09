const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');

const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'PUT',
    'OPTIONS',
    'DELETE',
    'POST',
  ],

  allowedHeaders: [
    'Content-Type',
  ],
};

app.use(cors(corsOpts));


var connection = mysql.createConnection({
    //properties port 3306
    //host: 'localhost',
    host: 'db4free.net',
    //user: 'root',
    user: 'agasthya',
    password: 'agasthya',
    //database: 'expensedb'
    database: 'expensetooldb'
});

connection.connect((error) => {
    if(!!error) return console.log('Error : '+error);
    else return console.log("MySQL Connected ...");
});

//dashboard queries
app.get('/login', (req, res) => {
    //sql
    const UserName = req.query.UserName;
    const Password = req.query.Password;
    connection.query("select * from Users where UserName='"+UserName+"';", function (error, rows, fields) {
        if (!!error) console.log('Error : ' + error);
        else {
            const User = rows[0].UserName;
            const Pass = rows[0].Password;
            console.log(User,Password);
            if(Password === Pass) {
                return res.status(200).send(UserName);
            }else {
                return res.status(400).send("Failure");
            }
        }
    });
});

//dashboard queries
app.get('/dashboard', (req, res) => {
    //sql
    const mode = req.query.mode;
    if(mode === "dashincome") {
        connection.query("select Category, SUM(Income) As Income from Income group by Category;", function (error, rows, fields) {
            if (!!error) console.log('Error : ' + error);
            else {
                const data = JSON.stringify(rows);
                const resdata = '{"income":'+data+'}'
                console.log(resdata);
                return res.status(200).send(resdata);
            }
        });
    }
    if(mode === "dashexpenses") {
        connection.query("select Category, SUM(Expense) AS Expense from Expenses group by Category;", function (error, rows, fields) {
            if (!!error) console.log('Error : ' + error);
            else {
                const data = JSON.stringify(rows);
                const resdata = '{"expenses":'+data+'}'
                console.log(resdata);
                return res.status(200).send(resdata);
            }
        });
    }
});

//testurl
app.get('/dashboardtest', (req, res) => {
    connection.query("SELECT count(*) AS count FROM Expenses", function (error, rows, fields) {
        if (!!error) console.log('Error : ' + error);
        else {
            console.log(rows[0].count);
            return res.send(rows[0]);
        }
    });
});

//Expenses operations
app.get('/expenses', (req, res) => {
    //sql
    const mode = req.query.mode;
    const UserName = req.query.UserName;
    const Date = req.query.Date;
    const Category = req.query.Category;
    const Item = req.query.Category;
    const Expense = req.query.Expense;
    console.log(mode,UserName,Date,Category,Item,Expense);
    var count = 0;
    var expenseId = 0;
    if(mode === "create") {
        connection.query("SELECT count(*) AS count FROM Expenses", function (error, rows, fields) {
            if (!!error) console.log('Error : ' + error);
            else {
                count = rows[0].count;
                //console.log("query count : "+count);
                expenseId = count + 1;
                //console.log("query expenseId : "+expenseId);
                connection.query("INSERT INTO Expenses VALUES ("+expenseId+",'"+UserName+"','"+Date+"','"+Category+"','"+Item+"',"+Expense+")", function (error, rows, fields) {
                    if (!!error) console.log('Error : ' + error);
                    else return res.status(200).send("Success");
                });
            }
        });

    }
    else if(mode === "5expenses"){
        connection.query("SELECT ExpenseID, UserName, Date, Category, Expense FROM Expenses where  UserName='"+req.query.UserName+"' ORDER BY ExpenseID DESC LIMIT 5", function(error, rows, fields){
            if(!!error) console.log('Error : '+error);
            else {
                const data = JSON.stringify(rows);
                const resdata = '{"expenses":'+data+'}'
                console.log(resdata);
                return res.status(200).send(resdata);
            }
        });
    }
});

//Income Operations
app.get('/income', (req, res) => {
    //sql
    //sql
    const mode = req.query.mode;
    const UserName = req.query.UserName;
    const Date = req.query.Date;
    const Category = req.query.Category;
    const Income = req.query.Income;
    console.log(mode,UserName,Date,Category,Income);
    var count = 0;
    var incomeId = 0;
    if(mode === "create") {
        connection.query("SELECT count(*) AS count FROM Income", function (error, rows, fields) {
            if (!!error) console.log('Error : ' + error);
            else {
                count = rows[0].count;
                console.log("query count : "+count);
                incomeId = count + 1;
                connection.query("INSERT INTO Income VALUES ("+incomeId+",'"+UserName+"','"+Date+"','"+Category+"',"+Income+")", function (error, rows, fields) {
                    if (!!error) console.log('Error : ' + error);
                    else res.status(200).send("Success");
                });
            }
        });

    }
    else if(mode === "5earnings"){
        connection.query("SELECT * FROM Income where UserName='"+req.query.UserName+"' ORDER BY IncomeID DESC LIMIT 5", function(error, rows, fields){
            if(!!error) console.log('Error : '+error);
            else {
                //res.setHeader('Content-Type', 'application/json');
                const data = JSON.stringify(rows);
                const resdata = '{"income":'+data+'}'
                console.log(resdata);
                return res.status(200).send(resdata);
            }
        });
    }
});

//Goals Operations



const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Listening on port ${port} ...`)
});