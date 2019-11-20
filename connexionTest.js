var mysql = require('mysql');
var UserClass = require("./classes/User.js");
//import User from './classes/User.js'

 
console.log('Get connection ...');
 
var conn = mysql.createConnection({
  database: 'parkmanager',
  host: "localhost",
  user: "root",
  password: ""
});
/*
var connString = 'mysql://root:12345@localhost/mytestdb?charset=utf8_general_ci&timezone=-0700';
var conn = mysql.createConnection(connString);
 */
conn.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

  /*
  // Drop EMPLOYEES table if Exists!!
  var sql1 = "DROP TABLE IF EXISTS Employees ";
 
  conn.query(sql1, function(err, results) {
      if (err) throw err;
      console.log("Table EMPLOYEES dropped");
  });

  // Create EMPLOYEES Table.
  var sql2 = "CREATE TABLE Employees " +
      " (Id INT not null AUTO_INCREMENT, " +
      " Emp_No VARCHAR(20), " +
      " Full_Name VARCHAR(255), " +
      " Hire_Date DATE, " +
      " PRIMARY KEY (Id) )";

  conn.query(sql2, function(err, results) {
      if (err) throw err;
      console.log("Table Employees created");
  });

  var empNos = ["E01", "E02", "E03"];
  var fullNames = ["John", "Smith", "Gates"];
  var hireDates = ["22/10/2001", "11/11/2000", "12/12/1990"];

  // Insert Datas to EMPLOYEES.
  for (var i = 0; i < empNos.length; i++) {
      var sql3 = "Insert into Employees (Emp_No, Full_Name, Hire_Date) " //
          +
          " Values ('" + empNos[i] + "', '" + fullNames[i] + "', STR_TO_DATE('" + hireDates[i] + "', '%d/%m/%Y') )";

      conn.query(sql3, function(err, results) {
          if (err) throw err;
          console.log("Insert a record!");
      });
  }
  */

    var user = new User("aze@rt.com", "AZE", "ZT", "secret", "admin");
    console.log(user);

    var sql = user.getSQLrequest("CREATE");
    conn.query(sql, function(err, results) {
        if (err) throw err;
        console.log("Insert a record!");
    });

});

/** User Class **/
/*class User {
    constructor(email,lastname,firstname,password,role) {
        console.log('test');
        this.email = email;
        this.lastname = lastname;
        this.firstname = firstname;
        this.password = password;
        this.role = role;
        this.dtRegister = Date.now()/1000;        
    }

    getSQLrequest(type){
        switch (type) {
            case 'GET':
                var read = "SELECT * FROM users WHERE email LIKE '" + this.email + "'";
                return read;
                break;
            case 'CREATE':
                //var create = "INSERT INTO users (email, lastname, firstname, password, role, dtRegister) Values ('" + this.email + "', '" + this.lastname + "', '" + this.firstname + "', '" + this.password + "', '" +this. role + "', STR_TO_DATE('" + this.dtRegister + "', '%d/%m/%Y') )";
                var create = "INSERT INTO users (email, lastname, firstname, password, role, dtRegister) Values ('" + this.email + "', '" + this.lastname + "', '" + this.firstname + "', '" + this.password + "', '" +this. role + "', " + this.dtRegister + " )";
                return create;  
                break;  
            case 'UPDATE':
                console.log('Mangoes and papayas are $2.79 a pound.');
                break;
            case 'DELETE':
                console.log('Mangoes and papayas are $2.79 a pound.');
                break;
            default:
                console.log('Sorry, we are out of ' + expr + '.');
        }
    }
}*/
