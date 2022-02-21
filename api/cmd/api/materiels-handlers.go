package main

import (
	"errors"
	"fmt"
	"net/http"
	"strconv"

	"github.com/julienschmidt/httprouter"
)

// Les fonctions commençant par H consistent en des Handlers.

// HGetOneIntervention est le handler permettant de consulter les interventions d'un technicien.
// Il est appelé par l'URL "/v1/materiels/:id_client".
func (App *Application) HGetMaterielsByClient(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	// récuperer :id
	id, err := strconv.Atoi(ps.ByName("id_client"))
	if err != nil || id < 0 {
		err := fmt.Errorf("renseignez un id (%s incorrect)", ps.ByName("id_client"))
		App.errorJSON(w, err)
		return
	}

	// exécuter la requête SQL
	materiels, err := App.models.DB.QMaterielsByClient(id)
	if err != nil {
		err = errors.New("échec de la requête : " + err.Error())
		App.errorJSON(w, err)
		return
	}

	// envoyer le résultat
	err = App.writeJSON(w, http.StatusOK, materiels, "materiels")
	if err != nil {
		err = fmt.Errorf("échec de l'envoi JSON : %s", err.Error())
		App.errorJSON(w, err)
		return
	}
}
