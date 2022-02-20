package main

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
)

// routes est le routeur de notre API.
// Le routeur appelle une fonction selon le chemin de la requête HTTP reçue.
// Il fabrique une réponse HTTP vierge pour que la fonction puisse écrire ses résultats dedans.
// Une fois remplie, la réponse est transmise à enableCORS pour envoi.
func (app *application) routes() http.Handler {

	// Création du routeur
	router := httprouter.New()

	// Si une requête HTTP de méthode FUNC est effectuée à l'URL arg1, appeler le handler arg2.
	// Le handler reçoit implicitement la réponse HTTP vierge qu'il pourra remplir.

	// ----- SERVEUR -----
	// Le statut du serveur
	router.GET("/status", app.HStatus)

	// ----- TECHNICIENS -----
	// Un technicien
	router.GET("/v1/technicien/get/:matricule", app.HGetOneTechnicien)

	// Tous les techniciens
	router.GET("/v1/techniciens", app.HGetAllTechniciens)

	// Ajouter ou modifier un technicien
	router.POST("/v1/technicien/edit/:oldMatricule", app.HEditTechnicien)

	// Supprimer un technicien
	router.GET("/v1/technicien/delete/:matricule", app.HDeleteTechnicien)

	// ----- INTERVENTIONS -----
	// Une intervention
	router.GET("/v1/intervention/get/:id", app.HGetOneIntervention)

	// Les interventions d'un technicien
	router.GET("/v1/interventions/:matricule", app.HGetInterventionsByTechnicien)

	// Toutes les interventions
	router.GET("/v1/interventions", app.HGetAllInterventions)

	// Ajouter ou modifier une intervention
	router.POST("/v1/intervention/edit/:id", app.HEditIntervention)

	// Affecter une intervention
	router.GET("/v1/intervention/affect/:id/:matricule", app.HAffectIntervention)

	// Clôturer une intervention
	router.POST("/v1/intervention/close/:id", app.HCloseIntervention)

	// ----- MATERIELS -----
	// Les matériels d'un client
	router.GET("/v1/materiels/:id_client", app.HGetMaterielsByClient)

	// ----- FIN -----
	// appliquer les politiques CORS
	return app.enableCORS(router)
}
