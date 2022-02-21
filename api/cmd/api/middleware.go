package main

import "net/http"

// enableCORS définit la politique CORS utilisée par le serveur puis émet la réponse HTTP précédemment remplie
func (App *Application) enableCORS(router http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")

		router.ServeHTTP(w, r)
	})
}
