package models

import "database/sql"

// Models contient les modèles de chacune de nos BDD
type Models struct {
	DB FBNModel
}

// NewModels retourne l'ensemble des modèles de nos BDD
func NewModels(fbndb *sql.DB) Models {
	return Models{
		DB: FBNModel{DB: fbndb},
	}
}
