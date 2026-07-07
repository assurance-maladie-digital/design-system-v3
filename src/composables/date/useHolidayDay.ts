/**
 * Composable pour la gestion des jours fériés
 */

import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { locales } from '@/components/DatePicker/locales'

// Étendre dayjs avec le plugin customParseFormat
dayjs.extend(customParseFormat)

/**
 * Algorithme de GAUSS pour calculer la date de Pâques
 * @param annee - L'année pour laquelle calculer la date de Pâques
 * @returns Un objet contenant le jour et le mois de Pâques
 */
function calculPaquesGregorienne(annee: number): { jour: number, mois: number } {
	const val1 = (19 * (annee % 19) + 24) % 30
	const val2 = (2 * (annee % 4) + 4 * (annee % 7) + 6 * val1 + 5) % 7
	const sum = val1 + val2

	let jourPaques: number
	let moisPaques: number

	if (sum <= 9) {
		jourPaques = sum + 22
		moisPaques = 3
	}
	else {
		jourPaques = sum - 9
		moisPaques = 4
	}

	return { jour: jourPaques, mois: moisPaques }
}

/**
 * Calcule les jours fériés d'une année donnée
 * @param annee - L'année pour laquelle calculer les jours fériés
 * @param format - Format des jours fériés en retour (défaut : "DD/MM/YYYY")
 * @returns Un Set contenant la liste des jours fériés
 */
// Format littéral des chaînes de dates fixes utilisées dans getJoursFeries.
// Il ne doit pas dépendre de locales.formatDefault car ces chaînes sont toujours en JJ/MM/AAAA.
const FIXED_DATE_PARSE_FORMAT = 'DD/MM/YYYY'

export function getJoursFeries(annee: number, format: string = locales.formatDefault): Set<string> {
	const { jour: jourPaques, mois: moisPaques } = calculPaquesGregorienne(annee)
	const formatDay = (date: dayjs.Dayjs) => date.format(format)

	const jours = new Set([
		formatDay(dayjs(`01/01/${annee}`, FIXED_DATE_PARSE_FORMAT)), // Jour de l'an
		formatDay(dayjs(new Date(annee, moisPaques - 1, jourPaques + 1))), // Lundi de Pâques
		formatDay(dayjs(`01/05/${annee}`, FIXED_DATE_PARSE_FORMAT)), // Fête du travail
		formatDay(dayjs(`08/05/${annee}`, FIXED_DATE_PARSE_FORMAT)), // Victoire des alliés
		formatDay(dayjs(new Date(annee, moisPaques - 1, jourPaques + 39))), // Ascension
		formatDay(dayjs(new Date(annee, moisPaques - 1, jourPaques + 50))), // Lundi de Pentecôte
		formatDay(dayjs(`14/07/${annee}`, FIXED_DATE_PARSE_FORMAT)), // Fête Nationale
		formatDay(dayjs(`15/08/${annee}`, FIXED_DATE_PARSE_FORMAT)), // Assomption
		formatDay(dayjs(`01/11/${annee}`, FIXED_DATE_PARSE_FORMAT)), // Toussaint
		formatDay(dayjs(`11/11/${annee}`, FIXED_DATE_PARSE_FORMAT)), // Armistice
		formatDay(dayjs(`25/12/${annee}`, FIXED_DATE_PARSE_FORMAT)), // Noël
	])

	return jours
}

/**
 * Vérifie si une date est un jour férié
 * @param date - La date à vérifier (Date ou string)
 * @param format - Format de la date si elle est fournie en string (défaut : "DD/MM/YYYY")
 * @returns true si la date est un jour férié, false sinon
 */
export function isHolidayDay(date: Date | string, format: string = locales.formatDefault): boolean {
	// Convertir la date en objet dayjs
	const dateObj = typeof date === 'string'
		? dayjs(date, format)
		: dayjs(date)

	if (!dateObj.isValid()) {
		return false
	}

	const annee = dateObj.year()
	const joursFeries = getJoursFeries(annee, format)

	// Vérifier si la date formatée est dans l'ensemble des jours fériés
	return joursFeries.has(dateObj.format(format))
}

/**
 * Hook composable pour la gestion des jours fériés
 * @returns Fonctions pour gérer les jours fériés
 */
export function useHolidayDay() {
	return {
		getJoursFeries,
		isHolidayDay,
		calculPaquesGregorienne,
	}
}

export default useHolidayDay
