package main

import (
	"backend-app/models"
	"encoding/json"
	"errors"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

// Les fonctions commençant par H consistent en des Handlers.

// HGetOneTechnicien est le handler permettant de consulter un technicien en particulier par son matricule.
// Il est appelé par l'URL "/v1/technicien/get/:matricule".
func (app *application) HGetOneTechnicien(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	// récuperer :matricule
	matricule := ps.ByName("matricule")
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

// HGetAllTechnicien est le handler permettant de consulter l'ensemble des techniciens.
// Il est appelé par l'URL "/v1/techniciens".
func (app *application) HGetAllTechniciens(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {

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

// HDeleteTechnicien est le handler permettant de supprimer un technicien selon son matricule.
// Il est appelé par l'URL "/v1/technicien/delete/:matricule".
func (app *application) HDeleteTechnicien(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	// récuperer :matricule
	matricule := ps.ByName("matricule")

	// exécuter la requête SQL
	err := app.models.DB.QDeleteTechnicien(matricule)
	if err != nil {
		err = errors.New("échec de la suppression : " + err.Error())
		app.errorJSON(w, err)
		return
	}

	// retourner une réponse positive
	err = app.writeJSON(w, http.StatusOK, JsonResponse{OK: true}, "response")
	if err != nil {
		err = errors.New("échec de l'envoi JSON : " + err.Error())
		app.errorJSON(w, err)
		return
	}
}

// TechnicienPayload est le modèle de données qui n'inclut seulement que les champs du formulaire.
// Si on décidait d'enlever le matricule et l'email du formulaire, il faudrait les enlever de TechnicienPayload.
// Ils seraient ensuite calculées dans le handler et passés séparement à la variable de modèle Technicien.
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
	// foreign key (agence) references Agence (agence)
}

// HEditTechnicien est le handler pour la création et la modification des techniciens dans la BDD.
// Il est appelé par l'URL "/v1/technicien/edit/:oldMatricule".
// Si :oldMatricule vaut "nouveau", on crée un nouveau technicien.
// Sinon on modifie le technicien portant ce matricule.
// Les données utilisées proviennent du JSON envoyé par la requête HTTP de méthode POST à cet URL.
// Le JSON reçu doit correspondre au modèle "TechnicienPayload".
func (app *application) HEditTechnicien(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	// récuperer :oldMatricule
	oldMatricule := ps.ByName("oldMatricule")

	// lire le JSON
	var payload TechnicienPayload
	err := json.NewDecoder(r.Body).Decode(&payload)
	if err != nil {
		err = errors.New("échec lors du décodage du JSON pour l'édition d'un technicien : " + err.Error())
		app.errorJSON(w, err)
		return
	}

	// assigner les valeurs du JSON à une variable suivant le modèle Technicien
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

	// choix de la requête SQL à exécuter
	if oldMatricule == "nouveau" {
		err = app.models.DB.QInsertTechnicien(technicien)
		if err != nil {
			app.errorJSON(w, err)
			return
		}
	} else {
		err = app.models.DB.QUpdateTechnicien(oldMatricule, technicien)
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
