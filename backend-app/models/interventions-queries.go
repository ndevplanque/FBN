package models

import (
	"context"
	"database/sql"
	"log"
	"time"
)

// Les fonctions commençant par Q consistent en des requêtes SQL.

// QGetIntervention renvoie une intervention selon son id ou une erreur
func (fbn *FBNModel) QInterventionById(id int) (interface{}, error) {

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	// resultat attendu
	var intervention struct {
		ID         int     `json:"id"`
		DateHeure  string  `json:"date_heure"`
		Etat       int     `json:"etat"`
		Matricule  string  `json:"matricule"`
		IDClient   int     `json:"id_client"`
		DistanceKm float32 `json:"distance_km"`
		Materiels  []struct {
			NSerie      string `json:"n_serie"`
			Commentaire string `json:"commentaire"`
			TempsPasse  int    `json:"temps_passe"`
		} `json:"materiels"`
	}

	query := `
	SELECT id, date_heure, etat, matricule, id_client
	FROM intervention
	WHERE id=$1
	`
	row := fbn.DB.QueryRowContext(ctx, query, id)
	var nullable sql.NullString
	row.Scan(
		&intervention.ID,
		&intervention.DateHeure,
		&intervention.Etat,
		&nullable,
		&intervention.IDClient,
	)
	if nullable.Valid {
		intervention.Matricule = nullable.String
	}

	log.Println(intervention.IDClient)
	// retrouver la liste du matériel concerné par l'intervention
	query = `
	SELECT n_serie, commentaire, temps_passe
	FROM concerner
	WHERE id_intervention=$1
	`
	rows, err := fbn.DB.QueryContext(ctx, query, id)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var materiel struct {
			NSerie      string `json:"n_serie"`
			Commentaire string `json:"commentaire"`
			TempsPasse  int    `json:"temps_passe"`
		}
		err := rows.Scan(
			&materiel.NSerie,
			&materiel.Commentaire,
			&materiel.TempsPasse,
		)
		if err != nil {
			return nil, err
		}
		intervention.Materiels = append(intervention.Materiels, materiel)
	}

	return &intervention, nil
}

// QInterventionsByTechnicien renvoie les interventions d'un technicien ou une erreur
func (fbn *FBNModel) QInterventionsByTechnicien(matricule string) (interface{}, error) {

	// résultat attendu
	var interventions []struct {
		ID         int     `json:"id"`
		DateHeure  string  `json:"date_heure"`
		Etat       string  `json:"etat"`
		Matricule  string  `json:"matricule"`
		IDClient   int     `json:"id_client"`
		DistanceKm float32 `json:"distance_km"`
	}

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
	for rows.Next() {
		var intervention struct {
			ID         int     `json:"id"`
			DateHeure  string  `json:"date_heure"`
			Etat       string  `json:"etat"`
			Matricule  string  `json:"matricule"`
			IDClient   int     `json:"id_client"`
			DistanceKm float32 `json:"distance_km"`
		}
		var nullable sql.NullString
		err := rows.Scan(
			&intervention.ID,
			&intervention.DateHeure,
			&intervention.Etat,
			&nullable,
			&intervention.ID,
			&intervention.DistanceKm,
		)
		if nullable.Valid {
			intervention.Matricule = nullable.String
		}
		if err != nil {
			return nil, err
		}
		interventions = append(interventions, intervention)
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
		var nullable sql.NullString
		err := rows.Scan(
			&intervention.ID,
			&intervention.DateHeure,
			&intervention.Etat,
			&nullable,
			&intervention.IDClient,
		)
		if nullable.Valid {
			intervention.Matricule = nullable.String
		}
		if err != nil {
			return nil, err
		}
		interventions = append(interventions, &intervention)
	}

	return interventions, nil
}

// QInsertIntervention ajoute un intervention dans la BDD ou renvoie une erreur
func (fbn *FBNModel) QInsertIntervention(intervention Intervention, materiels []Concerner) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	// démarrer la transactioon
	tx, err := fbn.DB.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	// créer une intervention
	query := `
		INSERT INTO intervention (date_heure, etat, id_client)
		VALUES ($1, $2, $3)
		`
	_, err = tx.ExecContext(ctx, query,
		intervention.DateHeure,
		intervention.Etat,
		intervention.IDClient,
	)
	if err != nil {
		_ = tx.Rollback()
		return err
	}

	// ajouter des matériels concernés
	query = `
		INSERT INTO concerner (n_serie , id_intervention)
		VALUES ($1, $2)
		`
	for _, materiel := range materiels {
		_, err = tx.ExecContext(ctx, query,
			materiel.NSerie,
			intervention.ID)
		if err != nil {
			_ = tx.Rollback()
			return err
		}
	}

	// valider la transaction
	if err := tx.Commit(); err != nil {
		return err
	}

	return nil
}

// QUpdateIntervention modifie une intervention ou renvoie une erreur
func (fbn *FBNModel) QUpdateIntervention(id int, intervention Intervention, materiels []Concerner) error {
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
		&intervention.Matricule,
		&intervention.IDClient,
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
func (fbn *FBNModel) QCloseIntervention(intervention Intervention, materiels []Concerner) error {

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
	for _, materiel := range materiels {
		_, err = tx.ExecContext(ctx, query,
			materiel.Commentaire,
			materiel.TempsPasse,
			intervention.ID,
			materiel.NSerie)
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
