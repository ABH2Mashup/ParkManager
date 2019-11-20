var conn = require('../config/db');

class Parking {
    
    constructor(row) {
        this.name = row.name;
        this.address = row.address;
        this.zipCode = row.zipCode;
        this.city = row.city;
        this.country = row.country;
        this.type = row.type;
        this.nbPlaces = row.nbPlaces;
        this.nbEtages = row.nbEtages;
        this.dtCreated = Date.now()/1000;        
    }

    static findAllParkings(next){
        var sql = "SELECT * FROM parkings WHERE 1";
        conn.query(sql, function(err, results) {
            if (err)  next(results, err.sqlMessage);
            else next(results); 
        });
    }
    static findParkingById(id, next){
        var sql = "SELECT * FROM parkings WHERE id = " + id ;
        conn.query(sql, function(err, results) {
            if (err)  next(results, err.sqlMessage);
            else if(results === undefined || results.length == 0) next(results, "Parking introuvable");
            else next(results); 
        });
    }
    static findParkingByCity(city, next){
        var sql = "SELECT * FROM parkings WHERE city LIKE '" + city + "'";
        conn.query(sql, function(err, results) {
            if (err)  next(results, err.sqlMessage);
            else if(results === undefined || results.length == 0) next(results, "Parking introuvable");
            else next(results); 
        });
    }
    static createParking(parking, next){
        var sql = "INSERT INTO parkings (name, address, zipCode, city, country, type, nbPlaces, nbEtages, dtCreated) Values ('" + parking.name + "', '" + parking.address + "', '" + parking.zipCode + "', '" + parking.city + "', '" + parking.country + "', '"+ parking.type + "', " + parking.nbPlaces + ", " + parking.nbEtages + ", " + parking.dtCreated + " )";
        conn.query(sql, function(err, results) {
            if (err)  next(results, err.sqlMessage);
            else next(results);  
        });
    }
    static updateParking(parkingId, parking, next){
        var sql = "UPDATE parkings SET name = '" + parking.name + "', address = '" + parking.address + "', zipCode = '" + parking.zipCode + "', city = '" + parking.city + "', country = '" + parking.country + "', type = " + parking.type + ", nbPlaces = " + parking.nbPlaces + ", nbEtages = " + parking.nbEtages + " WHERE id = " + parkingId;
        conn.query(sql, function(err, results) {
            if (err)  next(results, err.sqlMessage);
            else next(results); 
        });
    }
    static deleteParking(parkingId, next){
        var sql = "DELETE FROM parkings WHERE id = " + parkingId;
        conn.query(sql, function(err, results) {
            if (err)  next(results, err.sqlMessage);
            else next(results); 
        });
    }

}

module.exports = Parking;