package main

import (
	"api/models"
	"context"
	"database/sql"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	_ "github.com/lib/pq"
)

const version = "1.0.0"

// config contient le port d'écoute et l'URL de la BDD.
type config struct {
	port int
	env  string
	db   struct {
		dsn string
	}
}

// Application contient la config, l'emplacement d'affichage des logs, et les modèles de données.
// Elle représente le noyau logique de l'API. Toutes les fonctions de notre programme lui sont greffées.
type Application struct {
	config config
	logger *log.Logger
	models models.Models
}

func main() {

	// les flags permettent de définir les os.Args manuellement
	var cfg config
	flag.IntVar(&cfg.port, "port", 4000, "Server port to listen on")
	flag.StringVar(&cfg.env, "env", "development", "Application environment (development|production)")
	flag.StringVar(&cfg.db.dsn, "dsn", "postgres://adminfbn:fbnlateamdesboss@localhost/fbn?sslmode=disable", "Postgres connection string")
	flag.Parse()

	// logger définit l'emplacement d'affichage des logs
	logger := log.New(os.Stdout, "", log.Ldate|log.Ltime)

	// connexion à la BDD
	db, err := openDB(cfg)
	if err != nil {
		logger.Fatal(err)
	}
	defer db.Close()

	// App est le nyau logique de notre API
	App := &Application{
		config: cfg,
		logger: logger,
		models: models.NewModels(db),
	}

	// srv représente le serveur, il écoute un port et redirige les demandes vers le routeur
	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", cfg.port),
		Handler:      App.Routes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	logger.Println("Starting server on port", cfg.port)

	// le serveur se met en route
	err = srv.ListenAndServe()
	if err != nil {
		log.Println(err)
	}
}

// openDB récupère l'URL de la BDD via son paramètre config, et renvoie la BDD ouverte ou une erreur.
func openDB(cfg config) (*sql.DB, error) {
	db, err := sql.Open("postgres", cfg.db.dsn)
	if err != nil {
		return nil, err
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err = db.PingContext(ctx)

	if err != nil {
		return nil, err
	}
	return db, nil
}
