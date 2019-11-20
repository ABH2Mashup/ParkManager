
var conn = require('../config/db');
var md5 = require('md5');

class User {
    
    constructor(row) {
        this.email = row.email;
        this.lastname = row.lastname;
        this.firstname = row.firstname;
        this.password = md5(row.password);
        this.role = row.role;
        this.dtRegister = Date.now()/1000;        
    }

    static findAllUsers(next){
        var sql = "SELECT * FROM users WHERE 1";
        conn.query(sql, function(err, results) {
            if (err)  next(results, err.sqlMessage);
            else next(results); 
        });
    }
    static findUserByEmail(email, next){
        var sql = "SELECT * FROM users WHERE email LIKE '" + email + "'";
        conn.query(sql, function(err, results) {
            if (err)  next(results, err.sqlMessage);
            else if(results === undefined || results.length == 0) next(results, "Utilisateur introuvable");
            else next(results); 
        });
    }
    static findUserById(id, next){
        var sql = "SELECT * FROM users WHERE id = '" + id + "'";
        conn.query(sql, function(err, results) {
            if (err)  next(results, err.sqlMessage);
            else if(results === undefined || results.length == 0) next(results, "Utilisateur introuvable");
            else next(results); 
        });
    }
    static createUser(user, next){
        var sql = "INSERT INTO users (email, lastname, firstname, password, role, dtRegister) Values ('" + user.email + "', '" + user.lastname + "', '" + user.firstname + "', '" + user.password + "', '" +user. role + "', " + user.dtRegister + " )";
        conn.query(sql, function(err, results) {
            if (err)  next(results, err.sqlMessage);
            else next(results);  
        });
    }
    static updateUser(userId, user, next){
        var sql = "UPDATE users SET email = '" + user.email + "', lastname = '" + user.lastname + "', firstname = '" + user.firstname + "', password = '" + user.password + "', role = '" + user.role + "' WHERE id = " + userId;
        conn.query(sql, function(err, results) {
            if (err)  next(results, err.sqlMessage);
            else next(results); 
        });
    }
    static deleteUser(userId, next){
        var sql = "DELETE FROM users WHERE id = " + userId;
        conn.query(sql, function(err, results) {
            if (err)  next(results, err.sqlMessage);
            else next(results); 
        });
    }
    
    static checkUserLogged(session, userId, adminOnly, next){
	    if(session.connected == true){
            var sql = "SELECT * FROM users WHERE id = " + session.userId;
            conn.query(sql, function(err, results) {
                if (err)  next(false, "Erreur interne");
                else if(results === undefined || results.length == 0) next(false, "Utilisateur introuvable");
                else {
                    var user = new User(results[0]);
                    if((!adminOnly && (results[0].id == session.userId || results[0].id == userId)) || user.role == "admin"){
                        next(true, "Connexion reussi", user.role); 
                    }
                    else{
                        next(false, "Vous n'avez pas accès à cette partie." );
                    }
                }
            });
        }
        else{
            next(false, "Vous devez être connecté." );
        } 
    }
}

module.exports = User;
