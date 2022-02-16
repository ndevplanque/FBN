package models

import (
	"context"
	"time"
)

// GetTechnicien renvoie un technicien et une erreur s'il y en a une
func (m *FBNModel) QTechnicienById(matricule string) (*Technicien, error) {

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `
	SELECT matricule, sexe, nom, prenom, adresse,
		code_postal, ville, pays, date_embauche,
		qualification, date_qualification, email,
		telephone, agence
	FROM technicien
	WHERE matricule=$1
	`

	row := m.DB.QueryRowContext(ctx, query, matricule)

	var technicien Technicien

	// Assigne les valeurs obtenues avec la requête SQL aux propriétés du technicien (voir fichier models.go)
	err := row.Scan(
		&technicien.Matricule,
		&technicien.Sexe,
		&technicien.Nom,
		&technicien.Prenom,
		&technicien.Adresse,
		&technicien.CodePostal,
		&technicien.Ville,
		&technicien.Pays,
		&technicien.DateEmbauche,
		&technicien.Qualification,
		&technicien.DateQualification,
		&technicien.Email,
		&technicien.Telephone,
		&technicien.Agence,
	)
	if err != nil {
		return nil, err
	}
	return &technicien, nil
}

// AllTechniciens renvoie tous les techniciens et une erreur s'il y en a une
func (m *FBNModel) QAllTechniciens() ([]*Technicien, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	query := `
	SELECT matricule, sexe, nom, prenom, adresse,
		code_postal, ville, pays, date_embauche,
		qualification, date_qualification, email,
		telephone, agence
	FROM technicien
	ORDER BY matricule
	`

	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}

	var techniciens []*Technicien

	for rows.Next() {
		var technicien Technicien
		err := rows.Scan(
			&technicien.Matricule,
			&technicien.Sexe,
			&technicien.Nom,
			&technicien.Prenom,
			&technicien.Adresse,
			&technicien.CodePostal,
			&technicien.Ville,
			&technicien.Pays,
			&technicien.DateEmbauche,
			&technicien.Qualification,
			&technicien.DateQualification,
			&technicien.Email,
			&technicien.Telephone,
			&technicien.Agence,
		)
		if err != nil {
			return nil, err
		}
		techniciens = append(techniciens, &technicien)
	}

	return techniciens, nil
}
