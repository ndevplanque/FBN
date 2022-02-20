package models

import (
	"context"
	"time"
)

// Les fonctions commençant par Q consistent en des requêtes SQL.

// QInterventionsByTechnicien renvoie les matériels d'un client ou une erreur
func (fbn *FBNModel) QMaterielsByClient(client int) ([]*Materiel, error) {

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `
	SELECT m.n_serie, m.date_vente, m.date_installation, m.prix_vente, m.emplacement, m.reference, m.id_contrat
	FROM materiel m, contrat c
	WHERE m.id_contrat=c.id 
	AND c.id_client=$1
	`

	rows, err := fbn.DB.QueryContext(ctx, query, client)
	if err != nil {
		return nil, err
	}

	var materiels []*Materiel
	for rows.Next() {
		var materiel Materiel
		err := rows.Scan(
			&materiel.NSerie,
			&materiel.DateVente,
			&materiel.DateInstallation,
			&materiel.PrixVente,
			&materiel.Emplacement,
			&materiel.Reference,
			&materiel.Contrat,
		)
		if err != nil {
			return nil, err
		}
		materiels = append(materiels, &materiel)
	}

	return materiels, nil
}
