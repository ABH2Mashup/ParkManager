var conn = require('../config/db');

class Reservation {
    
    constructor(row) {
        this.userId = row.userId;
        this.parkingId = row.parkingId;
        this.numPlace = row.numPlace;
        this.dtCreated = Math.round(Date.now()/1000);
        this.dtStart = row.dtStart;
        this.dtEstime = row.dtEstime;
        this.dtEnd;
        this.actif = 1;    
    }

    static findAllReservations(active, next){
        var sql = "SELECT * FROM reservations WHERE 1";
        if(active){
            var sql = "SELECT * FROM reservations WHERE actif = 1 AND dtStart <= " + (Math.round(Date.now()/1000)-1800) + " AND dtEstime >= " + Math.round(Date.now()/1000);
        }
        conn.query(sql, function(err, results) {
            if (err)  next(results, err.sqlMessage);
            else next(results); 
        });
    }
    static findReservationById(id, next){
        var sql = "SELECT * FROM reservations WHERE id = " + id;
        conn.query(sql, function(err, results) {
            if (err)  next(results, err.sqlMessage);
            else if(results === undefined || results.length == 0) next(results, "Reservation introuvable");
            else next(results); 
        });
    }
    static findReservationByUser(userId, active, next){
        var sql = "SELECT * FROM reservations WHERE userId = " + userId;
        if(active){
            var sql = "SELECT * FROM reservations WHERE userId = " + userId + " AND actif = 1 AND dtStart <= " + (Math.round(Date.now()/1000)-1800) + " AND dtEstime >= " + Math.round(Date.now()/1000);
        }
        conn.query(sql, function(err, results) {
            if (err)  next(results, err.sqlMessage);
            else if(results === undefined || results.length == 0) next(results, "Reservation introuvable");
            else next(results); 
        });
    }
    static findReservationByUserAndParking(userId, parkingId, active, next){
        var sql = "SELECT * FROM reservations WHERE userId = " + userId + " ORDER BY dtStart DESC";
        if(active){
            var sql = "SELECT * FROM reservations WHERE userId = " + userId + " AND parkingId = " +parkingId + " AND actif = 1 AND dtStart <= " + (Math.round(Date.now()/1000)-1800) + " AND dtEstime >= " + Math.round(Date.now()/1000) + " ORDER BY dtStart DESC";
        }
        conn.query(sql, function(err, results) {
            if (err)  next(results, err.sqlMessage);
            else if(results === undefined || results.length == 0) next(results, "Reservation introuvable");
            else next(results); 
        });
    }
    static findAllReservationsByParking(parking, active, dtStart, duree, next){
        var sql = "SELECT * FROM reservations WHERE parkingId = '" + parking.id + "'";
        if(active){
            var dtEstime = Math.round(Date.now()/1000);
            if(dtStart != "undefined" && duree != "undefined"){
                dtEstime = parseInt(dtStart) + parseInt(duree)*60;
            }
            else {
                dtStart = Math.round(Date.now()/1000)-1800;
            }
            var sql = "SELECT * FROM reservations WHERE parkingId = " + parking.id + " AND actif = 1 AND dtStart <= " + dtStart + " AND dtEstime >= " + dtEstime + " ORDER BY numPlace ASC";
        }
        conn.query(sql, function(err, results) {
            if (err)  next(results, err.sqlMessage);
            else next(results); 
        });
    }
    static createReservations(reservation, next){
        var sql = "INSERT INTO reservations (userId, parkingId, numPlace, dtCreated, dtStart, dtEstime, dtEnd, actif) Values ('" + reservation.userId + "', '" + reservation.parkingId + "', " + reservation.numPlace + ", '" + reservation.dtCreated + "', '" + reservation.dtStart + "', '" + reservation.dtEstime + "', null, " + reservation.actif + " )";
        conn.query(sql, function(err, results) {
            if (err)  next(results, err.sqlMessage);
            else next(results);  
        });
    }
    static updateReservation(reservationId, reservation, next){
        var sql = "UPDATE reservations SET userId = '" + reservation.userId + "', parkingId = '" + reservation.parkingId + "', numPlace = " + reservation.numPlace + ", dtCreated = '" + reservation.dtCreated + "', dtStart = '" + reservation.dtStart + "', dtEstime = '" + reservation.dtEstime + "', dtEnd = '" + reservation.dtEnd + "', actif = " + reservation.actif + " WHERE id = " + reservationId;
        conn.query(sql, function(err, results) {
            if (err)  next(results, err.sqlMessage);
            else next(results);  
        });
    }
        

}

module.exports = Reservation;