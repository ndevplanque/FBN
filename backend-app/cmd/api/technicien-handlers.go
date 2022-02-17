package main

import (
	"backend-app/models"
	"encoding/json"
	"errors"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

type jsonResponse struct {
	OK      bool   `json:"ok"`
	Message string `json:"message"`
}

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

type TechnicienPayload struct {
	Matricule         string `json:"matricule"`
	Sexe              string `json:"sexe"` // https://golangbyexample.com/character-in-go/
	Nom               string `json:"nom"`
	Prenom            string `json:"prenom"`
	Adresse           string `json:"adresse"`
	CodePostal        string `json:"codePostal"`
	Ville             string `json:"ville"`
	Pays              string `json:"pays"`
	DateEmbauche      string `json:"dateEmbauche"`
	Qualification     string `json:"qualification"`
	DateQualification string `json:"dateQualification"`
	Email             string `json:"email"`
	Telephone         string `json:"telephone"`
	Agence            string `json:"agence"`
	DbRow             string `json:"dbRow"`
	// foreign key (agence) references Agence (agence)
}

func (app *application) HEditTechnicien(w http.ResponseWriter, r *http.Request) {
	var payload TechnicienPayload

	err := json.NewDecoder(r.Body).Decode(&payload)
	if err != nil {
		err = errors.New("échec lors du décodage du JSON pour l'édition d'un technicien : " + err.Error())
		app.errorJSON(w, err)
		return
	}

	var technicien models.Technicien

	technicien.Matricule = payload.Matricule
	technicien.Sexe = payload.Sexe
	technicien.Nom = payload.Nom
	technicien.Prenom = payload.Prenom
	technicien.Adresse = payload.Adresse
	technicien.CodePostal = payload.CodePostal
	technicien.Ville = payload.Ville
	technicien.Pays = payload.Pays
	technicien.DateEmbauche = payload.DateEmbauche
	technicien.Qualification = payload.Qualification
	technicien.DateQualification = payload.DateQualification
	technicien.Email = payload.Email
	technicien.Telephone = payload.Telephone
	technicien.Agence = payload.Agence

	if payload.DbRow == "nouveau" {
		err = app.models.DB.QInsertTechnicien(technicien)
		if err != nil {
			app.errorJSON(w, err)
			return
		}
	} else {
		err = app.models.DB.QUpdateTechnicien(technicien, payload.DbRow)
		if err != nil {
			app.errorJSON(w, err)
			return
		}
	}

	ok := jsonResponse{
		OK: true,
	}
	err = app.writeJSON(w, http.StatusOK, ok, "response")
	if err != nil {
		err = errors.New("échec de l'envoi JSON : " + err.Error())
		app.errorJSON(w, err)
		return
	}
}

func (app *application) HSearchTechniciens(w http.ResponseWriter, r *http.Request) {

}
