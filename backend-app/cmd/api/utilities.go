package main

import (
	"encoding/json"
	"net/http"
)

// writeJSON renvoie un élément JSON (nommé selon l'arg "wrap") contenant les données (arg "data")
func (app *application) writeJSON(w http.ResponseWriter, status int, data interface{}, wrap string) error {
	wrapper := make(map[string]interface{})

	wrapper[wrap] = data

	js, err := json.MarshalIndent(wrapper, "", "\t")
	if err != nil {
		return err
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	w.Write(js)

	return nil
}

// errorJSON afficher l'erreur dans le JSON client et dans la console serveur
func (app *application) errorJSON(w http.ResponseWriter, err error) {
	// afficher l'erreur dans la console serveur
	app.logger.Print(err)

	// afficher l'erreur dans le JSON client
	type jsonError struct {
		Message string `json:"message"`
	}
	theError := jsonError{Message: err.Error()}
	app.writeJSON(w, http.StatusBadRequest, theError, "error")
}
