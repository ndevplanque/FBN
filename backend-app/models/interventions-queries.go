package models

import (
	"context"
	"time"
)

// Les fonctions commençant par Q consistent en des requêtes SQL.

// QGetIntervention renvoie une intervention selon son id ou une erreur
func (fbn *FBNModel) QInterventionById(id int) (*Intervention, error) {

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `
	SELECT intervention, dateHeure, etat, matricule, client
	FROM intervention
	WHERE intervention=$1
	`

	row := fbn.DB.QueryRowContext(ctx, query, id)

	var intervention Intervention
	err := row.Scan(
		&intervention.Intervention,
		&intervention.DateHeure,
		&intervention.Etat,
		&intervention.Matricule,
		&intervention.Client,
	)
	if err != nil {
		return nil, err
	}

	return &intervention, nil
}

// QGetIntervention renvoie les interventions d'un technicien ou une erreur
func (fbn *FBNModel) QInterventionsByTechnicien(matricule string) ([]*Intervention, error) {

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `
	SELECT intervention, dateHeure, etat, matricule, client
	FROM intervention
	WHERE etat="affectée"
	AND matricule=$1
	ORDER BY distance_km ASC
	`

	rows, err := fbn.DB.QueryContext(ctx, query, matricule)
	if err != nil {
		return nil, err
	}

	var interventions []*Intervention
	for rows.Next() {
		var intervention Intervention
		err := rows.Scan(
			&intervention.Intervention,
			&intervention.DateHeure,
			&intervention.Etat,
			&intervention.Matricule,
			&intervention.Client,
		)
		if err != nil {
			return nil, err
		}
		interventions = append(interventions, &intervention)
	}

	return interventions, nil
}

// QAllInterventions renvoie tous les interventions ou une erreur
func (fbn *FBNModel) QAllInterventions() ([]*Intervention, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	query := `
	SELECT intervention, date_heure, etat, matricule, client
	FROM intervention
	ORDER BY intervention
	`

	rows, err := fbn.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}

	var interventions []*Intervention
	for rows.Next() {
		var intervention Intervention
		err := rows.Scan(
			&intervention.Intervention,
			&intervention.DateHeure,
			&intervention.Etat,
			&intervention.Matricule,
			&intervention.Client,
		)
		if err != nil {
			return nil, err
		}
		interventions = append(interventions, &intervention)
	}

	return interventions, nil
}

// QInsertIntervention ajoute un intervention dans la BDD ou renvoie une erreur
func (fbn *FBNModel) QInsertIntervention(intervention Intervention) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	query := `
	INSERT INTO intervention (matricule, sexe, nom, prenom, adresse,
		code_postal, ville, pays, date_embauche, qualification,
		date_qualification, email, telephone, agence)
	VALUES ($1, $2, $3, $4, $5,
		$6, $7, $8, $9, $10,
		$11, $12, $13, $14)
	`

	_, err := fbn.DB.ExecContext(ctx, query,
		&intervention.Intervention,
		&intervention.DateHeure,
		&intervention.Etat,
		&intervention.Matricule,
		&intervention.Client,
	)

	if err != nil {
		return err
	}

	return nil
}

// QUpdateIntervention modifie le intervention de matricule "oldMatricule" ou renvoie une erreur
func (fbn *FBNModel) QUpdateIntervention(id int, intervention Intervention) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	query := `
	UPDATE intervention
	SET matricule = $1, sexe = $2, nom = $3, prenom = $4, adresse = $5,
		code_postal = $6, ville = $7, pays = $8, date_embauche = $9, qualification = $10,
		date_qualification = $11, email = $12, telephone = $13, agence = $14
	WHERE matricule = $15
	`

	_, err := fbn.DB.ExecContext(ctx, query,
		&intervention.DateHeure,
		&intervention.Etat,
		&intervention.Matricule,
		&intervention.Client,
	)

	if err != nil {
		return err
	}

	return nil
}

// QAffectIntervention affecte une intervention à un technicien ou renvoie une erreur
func (fbn *FBNModel) QAffectIntervention(id int, matricule string) error {

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `
	UPDATE intervention
	SET etat="affectée", matricule=(SELECT matricule FROM technicien WHERE matricule=$2)
	WHERE intervention=$1
	`

	_, err := fbn.DB.ExecContext(ctx, query, id, matricule)
	if err != nil {
		return err
	}

	return nil
}

// QCloseIntervention clôture une intervention ou renvoie une erreur
func (fbn *FBNModel) QCloseIntervention(id int, materiels []*Concerner) error {

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	// démarrer la transactioon
	tx, err := fbn.DB.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	// renseigner les commentaires et temps passés de chaque matériel
	query := `
	UPDATE concerner
	SET commentaire=$1, temps_passe=$2
	WHERE intervention=$3 AND n_serie=$4
	`
	for _, materiel := range materiels {
		_, err = tx.ExecContext(ctx, query,
			&materiel.Commentaire,
			&materiel.TempsPasse,
			id,
			&materiel.NSerie)
		if err != nil {
			_ = tx.Rollback()
			return err
		}
	}

	// clôturer l'intervention
	query = `
	UPDATE intervention
	SET etat="clôturée"
	WHERE intervention=$1
	`
	_, err = tx.ExecContext(ctx, query, id)
	if err != nil {
		_ = tx.Rollback()
		return err
	}

	// valider la transaction
	if err := tx.Commit(); err != nil {
		return err
	}

	return nil
}
