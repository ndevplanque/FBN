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
	router.GET("/status", app.HStatus)
	router.GET("/v1/technicien/get/:matricule", app.HGetOneTechnicien)
	router.GET("/v1/techniciens", app.HGetAllTechniciens)
	router.POST("/v1/technicien/edit/:oldMatricule", app.HEditTechnicien)
	router.GET("/v1/technicien/delete/:matricule", app.HDeleteTechnicien)
	//router.GET("/v1/technicien/search/:matricule", app.HSearchTechniciens)

	return app.enableCORS(router)
}
