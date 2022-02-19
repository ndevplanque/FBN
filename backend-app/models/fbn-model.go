package models

import "database/sql"

// FBNModel est le nom du modèle de la BDD "fbn"
type FBNModel struct {
	DB *sql.DB
}

// Agence est le modèle pour les agences
type Agence struct {
	Agence     string `json:"agence"`
	Nom        string `json:"nom"`
	Adresse    string `json:"adresse"`
	CodePostal string `json:"code_postal"`
	Ville      string `json:"ville"`
	Telephone  string `json:"telephone"`
	Email      string `json:"email"`
}

// Client est le modèle pour les clients
type Client struct {
	Client             string  `json:"client"`
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
	Agence             string  `json:"agence"`
	// foreign key (agence) references Agence (agence)
}

// Concerner sert dans l'association n-aire de Intervention et Matériel
type Concerner struct {
	NSerie       string `json:"n_serie"`
	Intervention int    `json:"intervention"`
	Commentaire  string `json:"commentaire"`
	TempsPasse   int    `json:"temps_passe"`
	// foreign key (intervention) references Intervention (intervention)
	// foreign key (serie) references Materiel (serie)
}

// Contrat est le modèle pour les contrats
type Contrat struct {
	Contrat            string `json:"contrat"`
	DateSignature      string `json:"dateSignature"`
	DateRenouvellement string `json:"dateRenouvellement"`
	Client             string `json:"client"`
	// foreign key (client) references Client (client)
}

// Gerant est le modèle pour les gérants
type Gerant struct {
	Matricule    string `json:"matricule"`
	Sexe         string `json:"sexe"` // https://golangbyexample.com/character-in-go/
	Nom          string `json:"nom"`
	Prenom       string `json:"prenom"`
	Adresse      string `json:"adresse"`
	CodePostal   string `json:"codePostal"`
	Ville        string `json:"ville"`
	Pays         string `json:"pays"`
	DateEmbauche string `json:"dateEmbauche"`
	Agence       string `json:"agence"`
	// foreign key (agence) references Agence (agence)
}

// Intervention est le modèle pour les interventions
type Intervention struct {
	Intervention int    `json:"intervention"`
	DateHeure    string `json:"dateHeure"`
	Etat         string `json:"etat"`
	Matricule    string `json:"matricule"`
	Client       string `json:"client"`
	// foreign key (matricule) references Technicien (matricule)
	// foreign key (client) references Client (client)
}

// Materiel est le modèle pour les matériels
type Materiel struct {
	NSerie           string  `json:"n_serie"`
	DateVente        string  `json:"dateVente"`
	DateInstallation string  `json:"dateInstallation"`
	PrixVente        float32 `json:"prixVente"`
	Emplacement      string  `json:"emplacement"`
	Reference        string  `json:"reference"`
	Contrat          string  `json:"contrat"`
	// foreign key (reference) references Type (reference)
	// foreign key (contrat) references Contrat (contrat)
}

// Technicien est le modèle pour les techniciens
type Technicien struct {
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

// Type est le modèle pour les types de matériel
type Type struct {
	Reference string `json:"reference"`
	Libelle   string `json:"libelle"`
}
