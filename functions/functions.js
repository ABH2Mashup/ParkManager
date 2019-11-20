
class functions {
    static listUsersJSON(results){
        var users = [];
        results.forEach((user, index) => {
            var jsonUser = { id : user.id,
                            email : user.email,
                            lastname : user.lastname,
                            firstname : user.firstname,
                            role : user.role };
            users.push(jsonUser)
        });
        return users;
    };

    
    static listParkingsJSON(parking, results, role){
        var jsonParking;
        if(role == "user"){
            jsonParking = { id : parking.id,
                name : parking.name,
                city : parking.city,
                type : parking.type,
                nbPlaces : parking.nbPlaces,
                nbEtages : parking.nbEtages };
        }
        else{
            var nbPlaceLibre = parking.nbPlaces;
            var tauxOccupation = 0;
            if(results.length){
                nbPlaceLibre = parking.nbPlaces - results.length;    
                tauxOccupation = (results.length / parking.nbPlaces) * 100;
            }
            jsonParking = { id : parking.id,
                name : parking.name,
                city : parking.city,
                type : parking.type,
                nbPlaces : parking.nbPlaces,
                nbEtages : parking.nbEtages,
                nbPlacesLibre : nbPlaceLibre,
                tauxOccupation : tauxOccupation };
        }
        return jsonParking;
    };

    static listReservationsJSON(results, parking){
        var reservations = [];
        results.forEach((reservation, index) => {
            var nbPlacesEtage = Math.round(parking.nbPlaces / parking.nbEtages);
            var numeroEtage =  Math.round(reservation.numPlace / nbPlacesEtage);
            var numeroPlace = reservation.numPlace % nbPlacesEtage;
            var jsonReservation = { id : reservation.id,
                            userId : reservation.userId,
                            parkingId : reservation.parkingId,
                            /*numPlace : reservation.numPlace,*/
                            etage : numeroEtage,
                            numeroPlace : numeroPlace,
                            dtCreated : reservation.dtCreated,
                            dtStart : reservation.dtStart,
                            dtEnd : reservation.dtEnd,
                            actif : reservation.actif };
            reservations.push(jsonReservation)
        });
        return reservations;
    };
}

module.exports = functions;
