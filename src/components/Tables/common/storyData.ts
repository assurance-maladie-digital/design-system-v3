import type { DataTableHeaders, Items } from './types'

/**
 * Jeu de données de démonstration partagé par les stories des tableaux
 * (SyTable / SyServerTable). Évite de redéfinir les mêmes `headers` / `items`
 * dans chaque story. Les jeux spécifiques à une story restent définis localement.
 */

export const usersHeaders: DataTableHeaders[] = [
	{ title: 'Nom', key: 'lastname' },
	{ title: 'Prénom', key: 'firstname' },
	{ title: 'Email', value: 'email' },
]

export const users: Items = [
	{ firstname: 'Virginie', lastname: 'Beauchesne', email: 'virginie.beauchesne@example.com' },
	{ firstname: 'Simone', lastname: 'Bellefeuille', email: 'simone.bellefeuille@example.com' },
	{ firstname: 'Étienne', lastname: 'Salois', email: 'etienne.salois@example.com' },
	{ firstname: 'Thierry', lastname: 'Bobu', email: 'thierry.bobu@example.com' },
	{ firstname: 'Bernadette', lastname: 'Langelier', email: 'bernadette.langelier@exemple.com' },
	{ firstname: 'Agate', lastname: 'Roy', email: 'agate.roy@exemple.com' },
]

/** Jeu client plus long (14 lignes) pour les démos de pagination (client). */
export const manyUsers: Items = [
	{ firstname: 'Virginie', lastname: 'Beauchesne', email: 'virginie.beauchesne@example.com' },
	{ firstname: 'Simone', lastname: 'Bellefeuille', email: 'simone.bellefeuille@example.com' },
	{ firstname: 'Étienne', lastname: 'Salois', email: 'etienne.salois@example.com' },
	{ firstname: 'Thierry', lastname: 'Bobu', email: 'thierry.bobu@example.com' },
	{ firstname: 'Bernadette', lastname: 'Langelier', email: 'bernadette.langelier@example.com' },
	{ firstname: 'Agate', lastname: 'Roy', email: 'agate.roy@example.com' },
	{ firstname: 'Théo', lastname: 'Garnier', email: 'theo.garnier@example.com' },
	{ firstname: 'Clara', lastname: 'Moreau', email: 'clara.moreau@example.com' },
	{ firstname: 'Lucas', lastname: 'Lefebvre', email: 'lucas.lefebvre@example.com' },
	{ firstname: 'Emma', lastname: 'Dubois', email: 'emma.dubois@example.com' },
	{ firstname: 'Julien', lastname: 'Martin', email: 'julien.martin@example.com' },
	{ firstname: 'Sophie', lastname: 'Bernard', email: 'sophie.bernard@example.com' },
	{ firstname: 'Antoine', lastname: 'Lemoine', email: 'antoine.lemoine@example.com' },
	{ firstname: 'Camille', lastname: 'Rousseau', email: 'camille.rousseau@example.com' },
]

/**
 * Jeu « large » (10 colonnes, 12 lignes) pour les démos de colonnes :
 * redimensionnement, épinglage, contrôles de colonnes. Les largeurs sont
 * définies par colonne et les dates sont statiques (rendu déterministe).
 */
export const wideHeaders: DataTableHeaders[] = [
	{ title: 'ID', key: 'id', width: 80 },
	{ title: 'Nom', key: 'lastname', width: 160 },
	{ title: 'Prénom', key: 'firstname', width: 160 },
	{ title: 'Email', key: 'email', width: 240 },
	{ title: 'Ville', key: 'city', width: 160 },
	{ title: 'Pays', key: 'country', width: 160 },
	{ title: 'Téléphone', key: 'phone', width: 180 },
	{ title: 'Statut', key: 'status', width: 140 },
	{ title: 'Dernière connexion', key: 'lastLogin', width: 200 },
	{ title: 'Actions', key: 'actions', width: 140 },
]

function makeWideUsers(count: number): Items {
	return Array.from({ length: count }).map((_, i) => ({
		id: i + 1,
		lastname: 'Nom ' + (i + 1),
		firstname: 'Prénom ' + (i + 1),
		email: 'user' + (i + 1) + '@example.com',
		city: 'Paris',
		country: 'France',
		phone: '01 02 03 04 05',
		status: i % 2 === 0 ? 'Actif' : 'Inactif',
		lastLogin: String((i % 28) + 1).padStart(2, '0') + '/06/2026',
		actions: '…',
	}))
}

/** 12 lignes larges (démos client). */
export const wideUsers: Items = makeWideUsers(12)

/** 30 lignes larges (démos serveur : pagination sur colonnes épinglées). */
export const wideServerUsers: Items = makeWideUsers(30)

/** Jeu plus large (15 lignes) pour les démos de pagination / tri côté serveur. */
export const serverUsers: Record<string, string>[] = [
	{ firstname: 'Virginie', lastname: 'Beauchesne', email: 'virginie.beauchesne@example.com' },
	{ firstname: 'Simone', lastname: 'Bellefeuille', email: 'simone.bellefeuille@example.com' },
	{ firstname: 'Étienne', lastname: 'Salois', email: 'etienne.salois@example.com' },
	{ firstname: 'Bernadette', lastname: 'Langelier', email: 'bernadette.langelier@example.com' },
	{ firstname: 'Agate', lastname: 'Roy', email: 'agate.roy@example.com' },
	{ firstname: 'Louis', lastname: 'Denis', email: 'louis.denis@example.com' },
	{ firstname: 'Édith', lastname: 'Cartier', email: 'edith.cartier@example.com' },
	{ firstname: 'Alphonse', lastname: 'Bouvier', email: 'alphonse.bouvier@example.com' },
	{ firstname: 'Eustache', lastname: 'Dubois', email: 'eustache.dubois@example.com' },
	{ firstname: 'Rosemarie', lastname: 'Quessy', email: 'rosemarie.quessy@example.com' },
	{ firstname: 'Serge', lastname: 'Rivard', email: 'serge.rivard@example.com' },
	{ firstname: 'Jacques', lastname: 'Demers', email: 'jacques.demers@example.com' },
	{ firstname: 'Aimée', lastname: 'Josseaume', email: 'aimee.josseaume@example.com' },
	{ firstname: 'Delphine', lastname: 'Robillard', email: 'delphine.robillard@example.com' },
	{ firstname: 'Alexandre', lastname: 'Lazure', email: 'alexandre.lazure@example.com' },
]
