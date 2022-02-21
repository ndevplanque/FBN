package main

import (
	"encoding/json"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

// AppStatus contient l'état du serveur
type AppStatus struct {
	Status      string `json:"status"`
	Environment string `json:"environment"`
	Version     string `json:"version"`
}

// HStatus est le handler permettant de consulter l'état du serveur
func (App *Application) HStatus(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {

	// récupération des variables serveur
	currentStatus := AppStatus{
		Status:      "Available",
		Environment: App.config.env,
		Version:     version,
	}

	// création du json à renvoyer
	js, err := json.MarshalIndent(currentStatus, "", "\t")
	if err != nil {
		App.logger.Println(err)
	}

	// envoi du json
	w.Header().Set("Content-Type", "Application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(js)
}
