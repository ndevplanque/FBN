package main

import (
	"api/models"
	"encoding/json"
	"errors"
	"net/http"
	"time"

	"github.com/julienschmidt/httprouter"
)

// Les fonctions commençant par H consistent en des Handlers.

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
}

// HGetOneTechnicien est le handler permettant de consulter un technicien en particulier par son matricule.
// Il est appelé par l'URL "/v1/technicien/get/:matricule".
func (App *Application) HGetOneTechnicien(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	// récuperer :matricule
	matricule := ps.ByName("matricule")
	if matricule == "" {
		err := errors.New("renseignez un matricule (" + matricule + " incorrect)")
		App.errorJSON(w, err)
		return
	}
	App.logger.Println("Matricule:", matricule)

	// exécuter la requête SQL
	technicien, err := App.models.DB.QTechnicienById(matricule)
	if err != nil {
		err = errors.New("échec de la requête : " + err.Error())
		App.errorJSON(w, err)
		return
	}

	// envoyer le résultat
	err = App.writeJSON(w, http.StatusOK, technicien, "technicien")
	if err != nil {
		err = errors.New("échec de l'envoi JSON : " + err.Error())
		App.errorJSON(w, err)
		return
	}
}

// HGetAllTechnicien est le handler permettant de consulter l'ensemble des techniciens.
// Il est appelé par l'URL "/v1/techniciens".
func (App *Application) HGetAllTechniciens(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {

	// exécuter la requête SQL
	techniciens, err := App.models.DB.QAllTechniciens()
	if err != nil {
		err = errors.New("échec de la requête : " + err.Error())
		App.errorJSON(w, err)
		return
	}

	// envoyer le résultat
	err = App.writeJSON(w, http.StatusOK, techniciens, "techniciens")
	if err != nil {
		err = errors.New("échec de l'envoi JSON : " + err.Error())
		App.errorJSON(w, err)
		return
	}
}

// HDeleteTechnicien est le handler permettant de supprimer un technicien selon son matricule.
// Il est appelé par l'URL "/v1/technicien/delete/:matricule".
func (App *Application) HDeleteTechnicien(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	// récuperer :matricule
	matricule := ps.ByName("matricule")

	// exécuter la requête SQL
	err := App.models.DB.QDeleteTechnicien(matricule)
	if err != nil {
		err = errors.New("échec de la suppression : " + err.Error())
		App.errorJSON(w, err)
		return
	}

	// retourner une réponse positive
	err = App.writeJSON(w, http.StatusOK, JsonConfirm{OK: true}, "response")
	if err != nil {
		err = errors.New("échec de l'envoi JSON : " + err.Error())
		App.errorJSON(w, err)
		return
	}
}

// HEditTechnicien est le handler pour la création et la modification des techniciens dans la BDD.
// Il est appelé par l'URL "/v1/technicien/edit/:oldMatricule".
// Si :oldMatricule vaut "nouveau", on crée un nouveau technicien.
// Sinon on modifie le technicien portant ce matricule.
// Les données utilisées proviennent du JSON envoyé par la requête HTTP de méthode POST à cet URL.
// Le JSON reçu doit correspondre au modèle "TechnicienPayload".
func (App *Application) HEditTechnicien(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	// récuperer :oldMatricule
	oldMatricule := ps.ByName("oldMatricule")

	// lire le JSON
	var payload struct {
		Matricule         string `json:"matricule"`
		Sexe              string `json:"sexe"`
		Nom               string `json:"nom"`
		Prenom            string `json:"prenom"`
		Adresse           string `json:"adresse"`
		CodePostal        string `json:"code_postal"`
		Ville             string `json:"ville"`
		Pays              string `json:"pays"`
		DateEmbauche      string `json:"date_embauche"`
		Qualification     string `json:"qualification"`
		DateQualification string `json:"date_qualification"`
		Email             string `json:"email"`
		Telephone         string `json:"telephone"`
		CodeAgence        string `json:"code_agence"`
	}
	err := json.NewDecoder(r.Body).Decode(&payload)
	if err != nil {
		err = errors.New("échec lors du décodage du JSON pour l'édition d'un technicien : " + err.Error())
		App.errorJSON(w, err)
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
	technicien.DateEmbauche, err = time.Parse("2006-01-02", payload.DateEmbauche)
	if err != nil {
		App.errorJSON(w, err)
		return
	}
	technicien.Qualification = payload.Qualification
	technicien.DateQualification, err = time.Parse("2006-01-02", payload.DateQualification)
	if err != nil {
		App.errorJSON(w, err)
		return
	}
	technicien.Email = payload.Email
	technicien.Telephone = payload.Telephone
	technicien.CodeAgence = payload.CodeAgence

	// choix de la requête SQL à exécuter
	if oldMatricule == "nouveau" {
		err = App.models.DB.QInsertTechnicien(technicien)
		if err != nil {
			App.errorJSON(w, err)
			return
		}
	} else {
		err = App.models.DB.QUpdateTechnicien(oldMatricule, technicien)
		if err != nil {
			App.errorJSON(w, err)
			return
		}
	}

	// retourner une réponse positive
	err = App.writeJSON(w, http.StatusOK, JsonConfirm{OK: true}, "response")
	if err != nil {
		err = errors.New("échec de l'envoi JSON : " + err.Error())
		App.errorJSON(w, err)
		return
	}
}
