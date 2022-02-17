package main

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func (app *application) routes() http.Handler {
	router := httprouter.New()

	router.HandlerFunc(http.MethodGet, "/status", app.HStatusHandler)
	router.HandlerFunc(http.MethodGet, "/v1/technicien/get/:matricule", app.HGetOneTechnicien)
	router.HandlerFunc(http.MethodGet, "/v1/techniciens", app.HGetAllTechniciens)
	router.HandlerFunc(http.MethodPost, "/v1/technicien/edit/:oldMatricule", app.HEditTechnicien)
	router.HandlerFunc(http.MethodGet, "/v1/technicien/delete/:matricule", app.HDeleteTechnicien)
	//router.HandlerFunc(http.MethodGet, "/v1/technicien/search/:matricule", app.HSearchTechniciens)

	return app.enableCORS(router)
}
