package main

import (
	"backend-app/models"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strconv"

	"github.com/julienschmidt/httprouter"
)

// InterventionPayload est le modèle de données qui n'inclut seulement que les champs du formulaire.
type InterventionPayload struct {
	DateHeure string            `json:"date_heure"`
	Etat      string            `json:"etat"`
	Matricule string            `json:"matricule"`
	Client    string            `json:"client"`
	Materiel  []MaterielPayload `json:"materiel"`
}

type MaterielPayload struct {
	NSerie      string `json:"n_serie"`
	Commentaire string `json:"commentaire"`
	TempsPasse  int    `json:"temps_passe"`
}

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
func (app *application) HGetInterventions(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

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
	var payload InterventionPayload
	err := json.NewDecoder(r.Body).Decode(&payload)
	if err != nil {
		err = errors.New("échec lors du décodage JSON : " + err.Error())
		app.errorJSON(w, err)
		return
	}

	// assigner les valeurs du JSON à une variable suivant le modèle Intervention
	var intervention models.Intervention
	intervention.DateHeure = payload.DateHeure
	intervention.Etat = payload.Etat
	intervention.Matricule = payload.Matricule
	intervention.Client = payload.Client

	// choix de la requête SQL à exécuter
	if param == "nouveau" {
		err = app.models.DB.QInsertIntervention(intervention)
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
		err = app.models.DB.QUpdateIntervention(id, intervention)
		if err != nil {
			app.errorJSON(w, err)
			return
		}
	}

	// retourner une réponse positive
	err = app.writeJSON(w, http.StatusOK, JsonResponse{OK: true}, "response")
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
	err = app.writeJSON(w, http.StatusOK, JsonResponse{OK: true}, "response")
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
	var payload []MaterielPayload
	err = json.NewDecoder(r.Body).Decode(&payload)
	if err != nil {
		err = errors.New("échec lors du décodage JSON : " + err.Error())
		app.errorJSON(w, err)
		return
	}

	// remplir un tableau avec les matériels concernés par l'intervention
	var materiels []*models.Concerner
	for _, element := range payload {
		var materiel models.Concerner
		materiel.NSerie = element.NSerie
		materiel.Commentaire = element.Commentaire
		materiel.TempsPasse = element.TempsPasse
		if err != nil {
			return
		}
		materiels = append(materiels, &materiel)
	}

	// exécuter la requête SQL
	err = app.models.DB.QCloseIntervention(id, materiels)
	if err != nil {
		err = errors.New("échec de la requête : " + err.Error())
		app.errorJSON(w, err)
		return
	}

	// envoyer le résultat
	err = app.writeJSON(w, http.StatusOK, JsonResponse{OK: true}, "response")
	if err != nil {
		err = errors.New("échec de l'envoi JSON : " + err.Error())
		app.errorJSON(w, err)
		return
	}
}
