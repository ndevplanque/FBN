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

	var intervention Intervention

	// démarrer la transactioon
	tx, err := fbn.DB.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}

	// retrouver la liste du matériel concerné par l'intervention
	query := `
	SELECT n_serie, commentaire, temps_passe
	FROM concerner
	WHERE id=$1
	`
	rows, err := tx.QueryContext(ctx, query, id)
	if err != nil {
		_ = tx.Rollback()
		return nil, err
	}

	for rows.Next() {
		var materiel Concerner
		err := rows.Scan(
			&materiel.Materiel.NSerie,
			&materiel.Commentaire,
			&materiel.TempsPasse,
		)
		if err != nil {
			return nil, err
		}
		intervention.Materiels = append(intervention.Materiels, materiel)
	}

	query = `
	SELECT id, date_heure, etat, matricule, id_client
	FROM intervention
	WHERE id=$1
	`
	row := tx.QueryRowContext(ctx, query, id)
	if err != nil {
		_ = tx.Rollback()
		return nil, err
	}
	row.Scan(
		&intervention.ID,
		&intervention.DateHeure,
		&intervention.Etat,
		&intervention.Technicien.Matricule,
		&intervention.Client.ID,
	)

	// valider la transaction
	if err := tx.Commit(); err != nil {
		return nil, err
	}

	return &intervention, nil
}

// QInterventionsByTechnicien renvoie les interventions d'un technicien ou une erreur
func (fbn *FBNModel) QInterventionsByTechnicien(matricule string) ([]*Intervention, error) {

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `
	SELECT i.id, i.date_heure, i.etat, i.matricule, i.id_client, c.distance_km
	FROM intervention i, client c
	WHERE i.matricule=$1
	AND c.id=i.id_client
	ORDER BY c.distance_km ASC
	`

	rows, err := fbn.DB.QueryContext(ctx, query, matricule)
	if err != nil {
		return nil, err
	}

	var interventions []*Intervention
	for rows.Next() {
		var intervention Intervention
		err := rows.Scan(
			&intervention.ID,
			&intervention.DateHeure,
			&intervention.Etat,
			&intervention.Technicien.Matricule,
			&intervention.Client.ID,
			&intervention.Client.DistanceKm,
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
	SELECT id, date_heure, etat, matricule, id_client
	FROM intervention
	ORDER BY id
	`

	rows, err := fbn.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}

	var interventions []*Intervention
	for rows.Next() {
		var intervention Intervention
		err := rows.Scan(
			&intervention.ID,
			&intervention.DateHeure,
			&intervention.Etat,
			&intervention.Technicien.Matricule,
			&intervention.Client.ID,
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
	INSERT INTO intervention (date_heure, etat, matricule, id_client)
	VALUES ($1, $2, $3, $4)
	`

	_, err := fbn.DB.ExecContext(ctx, query,
		&intervention.DateHeure,
		&intervention.Etat,
		&intervention.Technicien.Matricule,
		&intervention.Client.ID,
	)

	if err != nil {
		return err
	}

	return nil
}

// QUpdateIntervention modifie une intervention ou renvoie une erreur
func (fbn *FBNModel) QUpdateIntervention(id int, intervention Intervention) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	query := `
	UPDATE intervention
	SET date_heure, etat, matricule, id_client
	WHERE matricule = $15
	`

	_, err := fbn.DB.ExecContext(ctx, query,
		&intervention.DateHeure,
		&intervention.Etat,
		&intervention.Technicien.Matricule,
		&intervention.Client.ID,
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
	SET matricule=(SELECT matricule FROM technicien WHERE matricule=$2)
	WHERE id=$1
	`

	_, err := fbn.DB.ExecContext(ctx, query, id, matricule)
	if err != nil {
		return err
	}

	return nil
}

// QCloseIntervention clôture une intervention ou renvoie une erreur
func (fbn *FBNModel) QCloseIntervention(intervention Intervention) error {

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
	WHERE id_intervention=$3 AND n_serie=$4
	`
	for _, materiel := range intervention.Materiels {
		_, err = tx.ExecContext(ctx, query,
			materiel.Commentaire,
			materiel.TempsPasse,
			intervention.ID,
			materiel.Materiel.NSerie)
		if err != nil {
			_ = tx.Rollback()
			return err
		}
	}

	// clôturer l'intervention
	query = `
	UPDATE intervention
	SET etat="clôturée"
	WHERE id=$1
	`
	_, err = tx.ExecContext(ctx, query, intervention.ID)
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
