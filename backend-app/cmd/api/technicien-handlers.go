package main

import (
	"errors"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func (app *application) HGetOneTechnicien(w http.ResponseWriter, r *http.Request) {
	// récuperer le matricule dans l'url (voir routes.go)
	params := httprouter.ParamsFromContext(r.Context())
	matricule := params.ByName("matricule")
	if matricule == "" {
		err := errors.New("renseignez un matricule (" + matricule + " incorrect)")
		app.errorJSON(w, err)
		return
	}
	app.logger.Println("Matricule:", matricule)

	// exécuter la requête SQL
	technicien, err := app.models.DB.QTechnicienById(matricule)
	if err != nil {
		err = errors.New("échec de la requête : " + err.Error())
		app.errorJSON(w, err)
		return
	}

	// envoyer le résultat
	err = app.writeJSON(w, http.StatusOK, technicien, "technicien")
	if err != nil {
		err = errors.New("échec de l'envoi JSON : " + err.Error())
		app.errorJSON(w, err)
		return
	}
}

func (app *application) HGetAllTechniciens(w http.ResponseWriter, r *http.Request) {
	// exécuter la requête SQL
	techniciens, err := app.models.DB.QAllTechniciens()
	if err != nil {
		err = errors.New("échec de la requête : " + err.Error())
		app.errorJSON(w, err)
		return
	}

	// envoyer le résultat
	err = app.writeJSON(w, http.StatusOK, techniciens, "techniciens")
	if err != nil {
		err = errors.New("échec de l'envoi JSON : " + err.Error())
		app.errorJSON(w, err)
		return
	}
}

func (app *application) HDeleteTechnicien(w http.ResponseWriter, r *http.Request) {

}

func (app *application) HEditTechnicien(w http.ResponseWriter, r *http.Request) {
	type jsonResponse struct {
		OK bool `json:"ok"`
	}

	ok := jsonResponse{
		OK: true,
	}
	err := app.writeJSON(w, http.StatusOK, ok, "response")
	if err != nil {
		err = errors.New("échec de l'envoi JSON : " + err.Error())
		app.errorJSON(w, err)
		return
	}
}

func (app *application) HSearchTechniciens(w http.ResponseWriter, r *http.Request) {

}
