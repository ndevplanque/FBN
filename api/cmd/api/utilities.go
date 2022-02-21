package main

import (
	"encoding/json"
	"net/http"
)

// jsonResponse permet de créer des éléments JSON correspondant au format "nom_propriete":valeur
type JsonConfirm struct {
	OK      bool   `json:"ok"`
	Message string `json:"message"`
}

// writeJSON émet une réponse contenant un JSON nommé selon "wrap" et contenant les données "data".
func (App *Application) writeJSON(w http.ResponseWriter, status int, data interface{}, wrap string) error {
	wrApper := make(map[string]interface{})

	wrApper[wrap] = data

	js, err := json.MarshalIndent(wrApper, "", "\t")
	if err != nil {
		return err
	}

	w.Header().Set("Content-Type", "Application/json")
	w.WriteHeader(status)
	w.Write(js)

	return nil
}

// errorJSON émet une réponse contenant un JSON décrivant l'erreur.
// L'erreur est également affichée dans le terminal.
func (App *Application) errorJSON(w http.ResponseWriter, err error) {
	// afficher l'erreur dans la console serveur
	App.logger.Print(err)

	// afficher l'erreur dans le JSON client
	type jsonError struct {
		Message string `json:"message"`
	}
	theError := jsonError{Message: err.Error()}
	App.writeJSON(w, http.StatusBadRequest, theError, "error")
}
