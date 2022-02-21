package main

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
)

// routes est le routeur de notre API.
// Le routeur Appelle une fonction selon le chemin de la requête HTTP reçue.
// Il fabrique une réponse HTTP vierge pour que la fonction puisse écrire ses résultats dedans.
// Une fois remplie, la réponse est transmise à enableCORS pour envoi.
func (App *Application) Routes() http.Handler {

	// Création du routeur
	router := httprouter.New()

	// Si une requête HTTP de méthode FUNC est effectuée à l'URL arg1, Appeler le handler arg2.
	// Le handler reçoit implicitement la réponse HTTP vierge qu'il pourra remplir.

	// ----- SERVEUR -----
	// Le statut du serveur
	router.GET("/status", App.HStatus)

	// ----- TECHNICIENS -----
	// Un technicien
	router.GET("/v1/technicien/get/:matricule", App.HGetOneTechnicien)

	// Tous les techniciens
	router.GET("/v1/techniciens", App.HGetAllTechniciens)

	// Ajouter ou modifier un technicien
	router.POST("/v1/technicien/edit/:oldMatricule", App.HEditTechnicien)

	// Supprimer un technicien
	router.GET("/v1/technicien/delete/:matricule", App.HDeleteTechnicien)

	// ----- INTERVENTIONS -----
	// Une intervention
	router.GET("/v1/intervention/get/:id", App.HGetOneIntervention)

	// Les interventions d'un technicien
	router.GET("/v1/interventions/:matricule", App.HGetInterventionsByTechnicien)

	// Toutes les interventions
	router.GET("/v1/interventions", App.HGetAllInterventions)

	// Ajouter ou modifier une intervention
	router.POST("/v1/intervention/edit/:id", App.HEditIntervention)

	// Affecter une intervention
	router.GET("/v1/intervention/affect/:id/:matricule", App.HAffectIntervention)

	// Clôturer une intervention
	router.POST("/v1/intervention/close/:id", App.HCloseIntervention)

	// ----- MATERIELS -----
	// Les matériels d'un client
	router.GET("/v1/materiels/:id_client", App.HGetMaterielsByClient)

	// ----- FIN -----
	// Appliquer les politiques CORS
	return App.enableCORS(router)
}
