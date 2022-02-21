package main

import (
	"backend-app/models"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/julienschmidt/httprouter"
)

// Les fonctions commençant par H consistent en des Handlers.

// HGetOneIntervention est le handler permettant de consulter une intervention.
// Il est appelé par l'URL "/v1/intervention/get/:id".
func (app *application) HGetOneIntervention(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	// récuperer :id
	id, err := strconv.Atoi(ps.ByName("id"))
	if err != nil || id < 0 {
		err := fmt.Errorf("renseignez un id (%s incorrect)", ps.ByName("id"))
		app.errorJSON(w, err)
		return
	}
	app.logger.Println("ID:", id)

	// exécuter la requête SQL
	intervention, err := app.models.DB.QInterventionById(id)
	if err != nil {
		err = errors.New("échec de la requête : " + err.Error())
		app.errorJSON(w, err)
		return
	}

	// envoyer le résultat
	err = app.writeJSON(w, http.StatusOK, intervention, "intervention")
	if err != nil {
		err = fmt.Errorf("échec de l'envoi JSON : %s", err.Error())
		app.errorJSON(w, err)
		return
	}
}

// HGetOneIntervention est le handler permettant de consulter les interventions d'un technicien.
// Il est appelé par l'URL "/v1/interventions/:matricule".
func (app *application) HGetInterventionsByTechnicien(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	// récuperer :matricule
	matricule := ps.ByName("matricule")
	if matricule == "" {
		err := errors.New("renseignez un id (" + matricule + " incorrect)")
		app.errorJSON(w, err)
		return
	}
	app.logger.Println("matricule:", matricule)

	// exécuter la requête SQL
	interventions, err := app.models.DB.QInterventionsByTechnicien(matricule)
	if err != nil {
		err = errors.New("échec de la requête : " + err.Error())
		app.errorJSON(w, err)
		return
	}

	// envoyer le résultat
	err = app.writeJSON(w, http.StatusOK, interventions, "interventions")
	if err != nil {
		err = errors.New("échec de l'envoi JSON : " + err.Error())
		app.errorJSON(w, err)
		return
	}
}

// HGetAllIntervention est le handler permettant de consulter l'ensemble des interventions.
// Il est appelé par l'URL "/v1/interventions".
func (app *application) HGetAllInterventions(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {

	// exécuter la requête SQL
	interventions, err := app.models.DB.QAllInterventions()
	if err != nil {
		err = errors.New("échec de la requête : " + err.Error())
		app.errorJSON(w, err)
		return
	}

	// envoyer le résultat
	err = app.writeJSON(w, http.StatusOK, interventions, "interventions")
	if err != nil {
		err = errors.New("échec de l'envoi JSON : " + err.Error())
		app.errorJSON(w, err)
		return
	}
}

// HEditIntervention est le handler pour la création et la modification des interventions dans la BDD.
// Il est appelé par l'URL "/v1/intervention/edit/:id".
// Si :id vaut "nouveau", on crée un nouveau intervention.
// Sinon on modifie l'intervention portant ce id.
// Les données utilisées proviennent du JSON envoyé par la requête HTTP de méthode POST à cet URL.
// Le JSON reçu doit correspondre au modèle "InterventionPayload".
func (app *application) HEditIntervention(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	// récuperer :id
	param := ps.ByName("id")

	// lire le JSON
	var payload struct {
		IDClient  string `json:"id_client"`
		DateHeure string `json:"date_heure"`
		Etat      int    `json:"etat"`
		Matricule string `json:"matricule"`
		Materiels []struct {
			NSerie      string `json:"n_serie"`
			Commentaire string `json:"commentaire"`
			TempsPasse  int    `json:"temps_passe"`
		} `json:"materiels"`
	}
	err := json.NewDecoder(r.Body).Decode(&payload)
	if err != nil {
		err = errors.New("échec lors du décodage JSON : " + err.Error())
		app.errorJSON(w, err)
		return
	}

	// assigner les valeurs du JSON à une variable suivant le modèle Intervention
	var intervention models.Intervention
	intervention.IDClient, err = strconv.Atoi(payload.IDClient)
	if err != nil {
		err = errors.New("le JSON ne convient pas : " + err.Error())
		app.errorJSON(w, err)
		return
	}
	intervention.DateHeure, err = time.Parse("2006-01-02", payload.DateHeure)
	if err != nil {
		err = errors.New("le JSON ne convient pas : " + err.Error())
		app.errorJSON(w, err)
		return
	}
	intervention.Etat = strconv.Itoa(payload.Etat)
	intervention.Matricule = payload.Matricule
	var materiels []models.Concerner
	for _, materiel := range payload.Materiels {
		var temp models.Concerner
		temp.NSerie = materiel.NSerie
		temp.Commentaire = materiel.Commentaire
		temp.TempsPasse = materiel.TempsPasse
		materiels = append(materiels, temp)
	}

	// choix de la requête SQL à exécuter
	if param == "nouveau" {
		err = app.models.DB.QInsertIntervention(intervention, materiels)
		if err != nil {
			app.errorJSON(w, err)
			return
		}
	} else {
		id, err := strconv.Atoi(param)
		if err != nil || id < 0 {
			err = fmt.Errorf("renseignez un id valide (%s incorrect)", param)
			app.errorJSON(w, err)
			return
		}
		err = app.models.DB.QUpdateIntervention(id, intervention, materiels)
		if err != nil {
			app.errorJSON(w, err)
			return
		}
	}

	// retourner une réponse positive
	err = app.writeJSON(w, http.StatusOK, JsonConfirm{OK: true}, "response")
	if err != nil {
		err = errors.New("échec de l'envoi JSON : " + err.Error())
		app.errorJSON(w, err)
		return
	}
}

// HAffectIntervention est le handler permettant d'affecter une intervention à un technicien.
// Il est appelé par l'URL "/v1/intervention/affect/:id/:matricule".
func (app *application) HAffectIntervention(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	// récuperer :id
	id, err := strconv.Atoi(ps.ByName("id"))
	if err != nil || id < 0 {
		err := fmt.Errorf("renseignez un id (%s incorrect)", ps.ByName("id"))
		app.errorJSON(w, err)
		return
	}

	// récupérer :matricule
	matricule := ps.ByName("matricule")

	// exécuter la requête SQL
	err = app.models.DB.QAffectIntervention(id, matricule)
	if err != nil {
		err = errors.New("échec de la requête : " + err.Error())
		app.errorJSON(w, err)
		return
	}

	// envoyer le résultat
	err = app.writeJSON(w, http.StatusOK, JsonConfirm{OK: true}, "response")
	if err != nil {
		err = errors.New("échec de l'envoi JSON : " + err.Error())
		app.errorJSON(w, err)
		return
	}
}

// HCloseIntervention est le handler permettant de clôturer une intervention.
// Il est appelé par l'URL "/v1/intervention/close/:id".
func (app *application) HCloseIntervention(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	// récuperer :id
	id, err := strconv.Atoi(ps.ByName("id"))
	if err != nil || id < 0 {
		err := fmt.Errorf("renseignez un id (%s incorrect)", ps.ByName("id"))
		app.errorJSON(w, err)
		return
	}

	// lire le JSON
	var payload struct {
		Materiels []struct {
			NSerie      string `json:"n_serie"`
			Commentaire string `json:"commentaire"`
			TempsPasse  int    `json:"temps_passe"`
		} `json:"materiels"`
	}
	err = json.NewDecoder(r.Body).Decode(&payload)
	if err != nil {
		err = errors.New("échec lors du décodage JSON : " + err.Error())
		app.errorJSON(w, err)
		return
	}

	// passer les données du JSON vers une variable suivant le modèle d'une intervention
	var intervention models.Intervention
	intervention.ID = id
	var materiels []models.Concerner
	for _, materiel := range payload.Materiels {
		var temp models.Concerner
		temp.NSerie = materiel.NSerie
		temp.Commentaire = materiel.Commentaire
		temp.TempsPasse = materiel.TempsPasse
		materiels = append(materiels, temp)
	}

	// exécuter la requête SQL
	err = app.models.DB.QCloseIntervention(intervention, materiels)
	if err != nil {
		err = errors.New("échec de la requête : " + err.Error())
		app.errorJSON(w, err)
		return
	}

	// envoyer le résultat
	err = app.writeJSON(w, http.StatusOK, JsonConfirm{OK: true}, "response")
	if err != nil {
		err = errors.New("échec de l'envoi JSON : " + err.Error())
		app.errorJSON(w, err)
		return
	}
}
