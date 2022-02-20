package models

import (
	"database/sql"
	"time"
)

// FBNModel est le nom du modèle de la BDD "fbn"
type FBNModel struct {
	DB *sql.DB
}

// Agence est le modèle pour les agences
type Agence struct {
	Code       string `json:"code"`
	Nom        string `json:"nom"`
	Adresse    string `json:"adresse"`
	CodePostal string `json:"code_postal"`
	Ville      string `json:"ville"`
	Telephone  string `json:"telephone"`
	Email      string `json:"email"`
}

// Client est le modèle pour les clients
type Client struct {
	ID                 int     `json:"id"`
	RaisonSociale      string  `json:"raison_sociale"`
	Siren              string  `json:"siren"`
	Ape                string  `json:"ape"`
	Adresse            string  `json:"adresse"`
	CodePostal         string  `json:"code_postal"`
	Ville              string  `json:"ville"`
	Pays               string  `json:"pays"`
	Telephone          string  `json:"telephone"`
	Email              string  `json:"email"`
	DistanceKm         float32 `json:"distance_km"`
	DeplacementMinutes float32 `json:"deplacement_minutes"`
	CodeAgence         string  `json:"code_agence"`
}

// Contrat est le modèle pour les contrats
type Contrat struct {
	ID                 int       `json:"id"`
	DateSignature      time.Time `json:"date_signature"`
	DateRenouvellement time.Time `json:"date_renouvellement"`
	Client             int       `json:"id_client"`
}

// Gerant est le modèle pour les gérants
type Gerant struct {
	Matricule    string    `json:"matricule"`
	Sexe         string    `json:"sexe"` // https://golangbyexample.com/character-in-go/
	Nom          string    `json:"nom"`
	Prenom       string    `json:"prenom"`
	Adresse      string    `json:"adresse"`
	CodePostal   string    `json:"code_postal"`
	Ville        string    `json:"ville"`
	Pays         string    `json:"pays"`
	DateEmbauche time.Time `json:"date_embauche"`
	CodeAgence   string    `json:"code_agence"`
}

// Intervention est le modèle pour les interventions
type Intervention struct {
	ID        int       `json:"id"`
	DateHeure time.Time `json:"date_heure"`
	Etat      string    `json:"etat"`
	Matricule string    `json:"matricule"`
	IDClient  int       `json:"id_client"`
}

type Concerner struct {
	IDIntervention int    `json:"id_intervention"`
	NSerie         string `json:"n_serie"`
	Commentaire    string `json:"commentaire"`
	TempsPasse     int    `json:"temps_passe"`
}

// Materiel est le modèle pour les matériels
type Materiel struct {
	NSerie           string    `json:"n_serie"`
	DateVente        time.Time `json:"date_vente"`
	DateInstallation time.Time `json:"date_installation"`
	PrixVente        float32   `json:"prix_vente"`
	Emplacement      string    `json:"emplacement"`
	Reference        string    `json:"reference"`
	Contrat          int       `json:"id_contrat"`
}

// Technicien est le modèle pour les techniciens
type Technicien struct {
	Matricule         string    `json:"matricule"`
	Sexe              string    `json:"sexe"`
	Nom               string    `json:"nom"`
	Prenom            string    `json:"prenom"`
	Adresse           string    `json:"adresse"`
	CodePostal        string    `json:"code_postal"`
	Ville             string    `json:"ville"`
	Pays              string    `json:"pays"`
	DateEmbauche      time.Time `json:"date_embauche"`
	Qualification     string    `json:"qualification"`
	DateQualification time.Time `json:"date_qualification"`
	Email             string    `json:"email"`
	Telephone         string    `json:"telephone"`
	CodeAgence        string    `json:"code_agence"`
}

// Type est le modèle pour les types de matériel
type Type struct {
	Reference string `json:"reference"`
	Libelle   string `json:"libelle"`
}
