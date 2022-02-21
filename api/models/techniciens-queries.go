package models

import (
	"context"
	"time"
)

// Les fonctions commençant par Q consistent en des requêtes SQL.

// QGetTechnicien renvoie un technicien selon son matricule ou une erreur
func (m *FBNModel) QTechnicienById(matricule string) (*Technicien, error) {

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `
	SELECT matricule, sexe, nom, prenom, adresse,
		code_postal, ville, pays, date_embauche,
		qualification, date_qualification, email,
		telephone, code_agence
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
		&technicien.CodeAgence,
	)
	if err != nil {
		return nil, err
	}
	return &technicien, nil
}

// QAllTechniciens renvoie tous les techniciens ou une erreur
func (m *FBNModel) QAllTechniciens() ([]*Technicien, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	query := `
	SELECT matricule, sexe, nom, prenom, adresse,
		code_postal, ville, pays, date_embauche,
		qualification, date_qualification, email,
		telephone, code_agence
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
			&technicien.CodeAgence,
		)
		if err != nil {
			return nil, err
		}
		techniciens = append(techniciens, &technicien)
	}

	return techniciens, nil
}

// QInsertTechnicien ajoute un technicien dans la BDD ou renvoie une erreur
func (m *FBNModel) QInsertTechnicien(technicien Technicien) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	query := `
	INSERT INTO technicien (matricule, sexe, nom, prenom, adresse,
		code_postal, ville, pays, date_embauche, qualification,
		date_qualification, email, telephone, code_agence)
	VALUES ($1, $2, $3, $4, $5,
		$6, $7, $8, $9, $10,
		$11, $12, $13, $14)
	`

	_, err := m.DB.ExecContext(ctx, query,
		technicien.Matricule,
		technicien.Sexe,
		technicien.Nom,
		technicien.Prenom,
		technicien.Adresse,
		technicien.CodePostal,
		technicien.Ville,
		technicien.Pays,
		technicien.DateEmbauche,
		technicien.Qualification,
		technicien.DateQualification,
		technicien.Email,
		technicien.Telephone,
		technicien.CodeAgence,
	)

	if err != nil {
		return err
	}

	return nil
}

// QUpdateTechnicien modifie le technicien de matricule "oldMatricule" ou renvoie une erreur
func (m *FBNModel) QUpdateTechnicien(oldMatricule string, technicien Technicien) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	query := `
	UPDATE technicien
	SET matricule = $1, sexe = $2, nom = $3, prenom = $4, adresse = $5,
		code_postal = $6, ville = $7, pays = $8, date_embauche = $9, qualification = $10,
		date_qualification = $11, email = $12, telephone = $13, code_agence = $14
	WHERE matricule = $15
	`

	_, err := m.DB.ExecContext(ctx, query,
		technicien.Matricule,
		technicien.Sexe,
		technicien.Nom,
		technicien.Prenom,
		technicien.Adresse,
		technicien.CodePostal,
		technicien.Ville,
		technicien.Pays,
		technicien.DateEmbauche,
		technicien.Qualification,
		technicien.DateQualification,
		technicien.Email,
		technicien.Telephone,
		technicien.CodeAgence,
		oldMatricule,
	)

	if err != nil {
		return err
	}

	return nil
}

// QDeleteTechnicien supprime un technicien de la BDD ou renvoie une erreur
func (m *FBNModel) QDeleteTechnicien(matricule string) error {

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	query := `
	DELETE FROM technicien
	WHERE matricule = $1
	`
	_, err := m.DB.ExecContext(ctx, query, matricule)

	if err != nil {
		return err
	}

	return nil

}
