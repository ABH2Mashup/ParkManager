var express = require('express'); 
var User = require('./classes/User');
var Parking = require('./classes/Parking');
var Reservation = require('./classes/Reservation');
//var listUsersJSON = require('./functions/listUsersJSON');
var functions = require('./functions/functions');
var md5 = require('md5');
var session = require('express-session');

var hostname = 'localhost'; 
var port = 3000; 

var app = express(); 
//app.set('trust proxy', 1) // trust first proxy
app.use(session({
	secret: 'secretsession',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false }
}));
 
var myRouter = express.Router(); 
 
myRouter.route('/')
.all(function(req,res){ 
    res.json({message : "Bienvenue sur ParkManager API ", methode : req.method});
}); 


myRouter.route('/api/users')
/* get list users */
.get(function(req,res){ 
	User.checkUserLogged(req.session, req.params.user_id, true, function (connected, message){
		if(connected){
			User.findAllUsers(function (results, error){
				if(error) {
					res.json({ erreur : error });
				}
				else{
					users = functions.listUsersJSON(results);
					res.json({
						message : "Liste des utilisateurs",
						users : users });
				}
			});
		}
		else{
			res.json({ message : message });
		}
	});
})
/* add user */
.post(function(req,res){ 
	var user = new User(req.body);
	User.createUser(user, function(resultsCreateUser, error){
		if(error) {
			res.json({ erreur : error });
		}
		else{
			User.findUserByEmail(user.email, function (results){
				users = functions.listUsersJSON(results);
				res.json({
					message : "Utilisateur créé",
					users : users });
			});
		}
	});
});
 
myRouter.route('/api/users/:user_id')
/* get specific user */
.get(function(req,res){ 
	User.checkUserLogged(req.session, req.params.user_id, false, function (connected, message){
		if(connected){
			User.findUserById(req.params.user_id, function (results, error){
				if(error) {
					res.json({ erreur : error });
				}
				else {
					users = functions.listUsersJSON(results);
					res.json({
						message : "Information utilisateur",
						users : users });
				}
			});
		}
		else{
			res.json({ message : message });
		}
	});
})
/* update specified user */
.put(function(req,res){ 
	User.checkUserLogged(req.session, req.params.user_id, false, function (connected, message){
		if(connected){
			User.findUserById(req.params.user_id, function (results, error){
				if(error) {
					res.json({ erreur : error });
				}
				else{
					//initialise l'user
					var user = new User(results[0]);
					//mis à jour user
					if(req.body.email !== undefined && req.body.email !== ""){
						user.email = req.body.email;
					}
					if(req.body.lastname !== undefined && req.body.lastname !== ""){
						user.lastname = req.body.lastname;
					}
					if(req.body.firstname !== undefined && req.body.firstname !== ""){
						user.firstname = req.body.firstname;
					}
					if(req.body.password !== undefined && req.body.password !== ""){
						user.password = md5(req.body.password);
					}
					if(req.body.role !== undefined && req.body.role !== ""){
						user.role = req.body.role;
					}
					User.updateUser(req.params.user_id, user, function (resultsUpdateUser, errorUpdateUser){
						if(errorUpdateUser) {
							res.json({ erreur : errorUpdateUser });
						}
						else{
							users = functions.listUsersJSON(results);
							res.json({
								message : "Information utilisateur",
								users : users });
						}
					});
				}
			});
		}
		else{
			res.json({ message : message });
		}
	});
})
/* remove specified user */
.delete(function(req,res){ 
	User.checkUserLogged(req.session, req.params.user_id, false, function (connected, message){
		if(connected){
			User.findUserById(req.params.user_id, function (results, error){
				if(error) {
					res.json({ erreur : error });
				}
				else{
					var user = functions.listUsersJSON(results);
					User.deleteUser(req.params.user_id, function (resultsDeleteUser, errorDeleteUser){
						if(errorDeleteUser) {
							res.json({ erreur : errorDeleteUser });
						}
						else{
							res.json({
								message : "Utilisateur supprimé",
								users : user });
						}
					});
				}
			});
		}
		else{
			res.json({ message : message });
		}
	});
});

myRouter.route('/api/users/login')
/* login user */
.post(function(req,res){  
	if (req.session.connected) {
		res.json({ erreur : "Utilisateur déjà connecté" });
	}
	else {
		User.findUserByEmail(req.body.email, function (results, error){
			if(error) {
				res.json({ erreur : error });
			}
			else{
				if(results[0].password == md5(req.body.password)){
					var user = functions.listUsersJSON(results);
					req.session.connected = true;
					req.session.cookie.connected = 1800000; 
					req.session.userId = results[0].id;
					req.session.cookie.connected = 1800000;
					res.json({
						message : "Utilisateur connecté",
						users : user });
				}
				else{
					res.json({ erreur : "Utilisateur non reconnue" });
				}
			}
		});
	}
});

myRouter.route('/api/users/logout')
/* logout user */
.delete(function(req,res){  
	if (req.session.connected) {
		res.json({ erreur : "Utilisateur déjà déconnecté" });
	}
	else {
		req.session.destroy(function(err) { });	  
		res.json({ message : "Utilisateur déconnecté" });
	}
});

myRouter.route('/api/parkings')
/* list parking with disponibility */
.get(function(req,res){  
	User.checkUserLogged(req.session, req.params.user_id, false, function (connected, message){
		if(connected){
			User.findUserById(req.session.userId, function (results, error){
				if(error) {
					Parking.findAllParkings(function (results, error){
						if(error) {
							res.json({ erreur : error });
						}
						else{
							var parkings = [];
							results.forEach((parking, index) => {
								Reservation.findAllReservationsByParking(parking, true, "undefined", "undefined", function (resultsReservation, errorReservation){
									jsonParking = functions.listParkingsJSON(parking, resultsReservation, "user");
									parkings.push(jsonParking);
									// au dernier passage on retourne la reponse
									if(index == results.length -1){
										res.json({
											message : "Liste des parkings du reseau",
											parkings : parkings });
									}
								});
							});
							
						}
					});
				}
				else{
					Parking.findAllParkings(function (results, error){
						if(error) {
							res.json({ erreur : error });
						}
						else{
							var parkings = [];
							results.forEach((parking, index) => {
								Reservation.findAllReservationsByParking(parking, true, "undefined", "undefined", function (resultsReservation, errorReservation){
									jsonParking = functions.listParkingsJSON(parking, resultsReservation, "admin");
									parkings.push(jsonParking);
									// au dernier passage on retourne la reponse
									if(index == results.length -1){
										res.json({
											message : "Liste des parkings du reseau",
											parkings : parkings });
									}
								});
							});
							
						}
					});
				}
			});
		}
		else{
			Parking.findAllParkings(function (results, error){
				if(error) {
					res.json({ erreur : error });
				}
				else{
					var parkings = [];
					results.forEach((parking, index) => {
						Reservation.findAllReservationsByParking(parking, true, "undefined", "undefined", function (resultsReservation, errorReservation){
							jsonParking = functions.listParkingsJSON(parking, resultsReservation, "user");
							parkings.push(jsonParking);
							// au dernier passage on retourne la reponse
							if(index == results.length -1){
								res.json({
									message : "Liste des parkings du reseau",
									parkings : parkings });
							}
						});
					});
					
				}
			});
		}
	});
})
/* create parking */
.post(function(req,res){
	User.checkUserLogged(req.session, req.params.user_id, true, function (connected, message){
		if(connected){
			User.findUserById(req.session.userId, function (results, error){
				if(error) {
					res.json({ erreur : error });
				}
				else{
					var parking = new Parking(req.body);
					Parking.createParking(parking, function(resultsCreateParking, errorParking){
						if(errorParking) {
							res.json({ erreur : errorParking });
						}
						else{
							res.json({ message : "Parking créé" });
						}
					});
				}
			});
		}
		else{
			res.json({ message : message });
		}
	});
});

myRouter.route('/api/parkings/:parking_id')
/* specific parking with disponibility */
.get(function(req,res){  
	User.checkUserLogged(req.session, req.params.user_id, false, function (connected, message){
		if(connected){
			User.findUserById(req.session.userId, function (results, error){
				if(error) {
					Parking.findParkingById(req.params.parking_id, function (results, error){
						if(error) {
							res.json({ erreur : error });
						}
						else{
							var parking = results[0];
							Reservation.findAllReservationsByParking(parking, true, "undefined", "undefined", function (resultsReservation, errorReservation){
								jsonParking = functions.listParkingsJSON(parking, resultsReservation, "user");
								res.json({
									message : "Information d'un parking du reseau",
									parkings : jsonParking });
							});	
						}
					});
				}
				else{
					Parking.findParkingById(req.params.parking_id, function (results, error){
						if(error) {
							res.json({ erreur : error });
						}
						else{
							var parking = results[0];
							Reservation.findAllReservationsByParking(parking, true, "undefined", "undefined", function (resultsReservation, errorReservation){
								jsonParking = functions.listParkingsJSON(parking, resultsReservation, "admin");
								res.json({
									message : "Information d'un parking du reseau",
									parkings : jsonParking });
							});	
						}
					});
				}
			});
		}
		else{
			Parking.findParkingById(req.params.parking_id, function (results, error){
				if(error) {
					res.json({ erreur : error });
				}
				else{
					var parking = results[0];
					Reservation.findAllReservationsByParking(parking, true, "undefined", "undefined", function (resultsReservation, errorReservation){
						jsonParking = functions.listParkingsJSON(parking, resultsReservation, "user");
						res.json({
							message : "Information d'un parking du reseau",
							parkings : jsonParking });
					});	
				}
			});
		}
	});
})
/* update specific parking */
.put(function(req,res){  
	User.checkUserLogged(req.session, req.params.user_id, true, function (connected, message){
		if(connected){
			User.findUserById(req.session.userId, function (resultsUser, errorUser){
				if(errorUser) {
					res.json({ erreur : errorUser });
				}
				else{
					Parking.findParkingById(req.params.parking_id, function (results, error){
						if(error) {
							res.json({ erreur : error });
						}
						else{
							//initialise le parking
							var parking = new Parking(results[0]);
							//mis à jour du parking
							if(req.body.name !== undefined && req.body.name !== ""){
								parking.name = req.body.name;
							}
							if(req.body.address !== undefined && req.body.address !== ""){
								parking.address = req.body.address;
							}
							if(req.body.zipCode !== undefined && req.body.zipCode !== ""){
								parking.zipCode = req.body.zipCode;
							}
							if(req.body.city !== undefined && req.body.city !== ""){
								parking.city = req.body.city;
							}
							if(req.body.country !== undefined && req.body.country !== ""){
								parking.country = req.body.country;
							}
							if(req.body.type !== undefined && req.body.type !== ""){
								parking.type = req.body.type;
							}
							if(req.body.nbPlaces !== undefined && req.body.nbPlaces !== ""){
								parking.nbPlaces = req.body.nbPlaces;
							}
							if(req.body.nbEtages !== undefined && req.body.nbEtages !== ""){
								parking.nbEtages = req.body.nbEtages;
							}
							Parking.updateParking(req.params.parking_id, parking, function (resultsUpdateParking, errorUpdateParking){
								if(errorUpdateParking) {
									res.json({ erreur : errorUpdateParking });
								}
								else{
									res.json({ message : "Parking mis à jour" });
								}
							});
						}
					});
				}
			});
		}
		else{
			res.json({ message : message });
		}
	});
})
/* remove specified parking */
.delete(function(req,res){ 
	User.checkUserLogged(req.session, req.params.user_id, true, function (connected, message){
		if(connected){
			Parking.findParkingById(req.params.parking_id, function (results, error){
				if(error) {
					res.json({ erreur : error });
				}
				else{
					var parking = functions.listParkingsJSON(results, null, "user");
					Parking.deleteParking(req.params.parking_id, function (resultsDeleteParking, errorDeleteParking){
						if(errorDeleteParking) {
							res.json({ erreur : errorDeleteParking });
						}
						else{
							res.json({
								message : "Parking supprimé",
								parking : parking });
						}
					});
				}
			});
		}
		else{
			res.json({ message : message });
		}
	});
});

myRouter.route('/api/parkings/:parking_id/reserve')
/* Reserve place de parking */
.post(function(req,res){  
	User.checkUserLogged(req.session, req.body.userId, false, function (connected, message){
		if(connected){
			Parking.findParkingById(req.params.parking_id, function (results, error){
				if(error) {
					res.json({ erreur : error });
				}
				else{
					var parking = results[0];
					// verifie si une reservation n'est pas déjà en cours (session)
					Reservation.findReservationByUserAndParking(req.session.userId, req.params.parking_id, true, function (resultsReservationByUser, errorReservationByUser){
						if(resultsReservationByUser && resultsReservationByUser.length == 0){
							Reservation.findAllReservationsByParking(parking, true, req.body.dtStart, req.body.duree, function (resultsReservation, errorReservation){
								if(typeof(resultsReservation) == 'undefined' || parking.nbPlaces > resultsReservation.length){
									// encore de la place	
									var data = [];
									data.userId = req.body.userId;
									data.parkingId = req.params.parking_id;
									data.dtStart = req.body.dtStart;
									//duree en minute
									data.dtEstime = parseInt(req.body.dtStart) + parseInt(req.body.duree)*60;
									if(typeof(resultsReservation) == 'undefined' || resultsReservation.length == 0){
										data.numPlace = 1;
									}
									else {
										var numPlaceMin = 1;
										//prepare tableau places dispo (1) et vide (0)
										var tabPlacesParking = [];
										for(var i=0; i<=parking.nbPlaces-1; i++){
											tabPlacesParking[i] = 0;
											resultsReservation.forEach((reservation, index) => {
												if(reservation.numPlace == i+1){
													tabPlacesParking[i] = 1;
												}
											});
										}
										for(var i=0; i<tabPlacesParking.length; i++){
											//si la place est vide
											if(tabPlacesParking[i] == 0){
												data.numPlace = i + 1;
												break;
											}
										}
									}
									var reservation = new Reservation(data);
									Reservation.createReservations(reservation, function (resultsCreateReservation, errorCreateReservation){
										if(errorCreateReservation) {
											res.json({ erreur : errorCreateReservation });
										}
										else{
											Reservation.findReservationByUser(reservation.userId, true, function (resultsFindReservation){
												reservations = functions.listReservationsJSON(resultsFindReservation, parking);
												res.json({
													message : "Reservation créé",
													reservations : reservations });
											});
										}
									});
								}
								else {
									// plus de place
									res.json({ message : "Plus de place disponible dans ce parking" });
								}
							});		
						}
						else {
							//vous avez dejà une place reservé 
							reservations = functions.listReservationsJSON(resultsReservationByUser, parking);
							res.json({
								message : "vous avez dejà une reservation en cours",
								reservations : reservations });
						}
					});
				}
			});
		}
		else{
			res.json({ message : message });
		}
	});
})
//libère la place de parking
.put(function(req,res){  
	User.checkUserLogged(req.session, req.body.userId, false, function (connected, message){
		if(connected){
			Parking.findParkingById(req.params.parking_id, function (results, error){
				if(error) {
					res.json({ erreur : error });
				}
				else{
					var userId = req.session.userId;
					if(typeof(req.body.userId) !== 'undefined' && req.body.userId != ""){
						userId = req.body.userId;
					}
					Reservation.findReservationByUser(userId, true, function (resultsReservation, errorReservation){
						if(typeof(resultsReservation) == 'undefined' || resultsReservation.length ==  0){
							//aucune place reservé
							res.json({ message : "Aucune place reservé par cet utilisateur" });
						}
						else{
							var reservation = resultsReservation[0];
							reservation.dtEnd = Math.round(Date.now()/1000);
							reservation.actif = 0;
							Reservation.updateReservation(reservation.id, reservation, function (resultsUpdateReservation, errorUpdateReservation){
								if(errorUpdateReservation) {
									res.json({ erreur : errorUpdateReservation });
								}
								else{
									var parking = results[0];
									var reservations = []
									reservations.push(reservation);
									reservationJSON = functions.listReservationsJSON(reservations, parking);
									res.json({
										message : "La reservation de parking a été libéré",
										reservation : reservationJSON });
								}
							});
						}
					});
				}
			});
		}
		else{
			res.json({ message : message });
		}
	});
});

myRouter.route('/api/find/parking')
/* Find parking of specific user logged */
.get(function(req,res){  
	User.checkUserLogged(req.session, req.body.userId, false, function (connected, message, role){
		if(connected){
			var userId = req.session.userId;
			if(role == "admin" && (req.body.userId !== undefined || req.body.userId != "")){
				userId = req.body.userId;
			}
			Reservation.findReservationByUser(userId, true, function (resultsReservation, errorReservation){
				if(typeof(resultsReservation) == 'undefined' || resultsReservation.length ==  0){
					//aucune place reservé
					res.json({ message : "Aucune place reservé par cet utilisateur" });
				}
				else{
					var reservation = resultsReservation[0];
					Parking.findParkingById(reservation.parkingId, function (results, error){
						if(error) {
							res.json({ erreur : error });
						}
						else{
							var parking = results[0];
							var reservations = []
							reservations.push(reservation);
							reservationJSON = functions.listReservationsJSON(reservations, parking);
							res.json({
								message : "Votre voiture est stationné à l'emplacement suivant",
								reservation : reservationJSON });
						}
					});
				}
			});
		}
		else{
			res.json({ message : message });
		}
	});
});
 

var bodyParser = require("body-parser"); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(myRouter);  
 
app.listen(port, hostname, function(){
	console.log("Mon serveur fonctionne sur http://"+ hostname +":"+port); 
});
