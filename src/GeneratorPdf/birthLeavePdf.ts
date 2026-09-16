import pdfMake from 'pdfmake/build/pdfmake'
import fonts from 'pdfmake/build/vfs_fonts'

import type {
	Content,
	TableCell,
	TDocumentDefinitions,
} from 'pdfmake/interfaces'

import logo from '@/assets/logos/logo-desktop.svg?raw'

import {
	addOneDay,
	calculateMonthEnd,
	formatFrenchDate,
} from './birthLeave'

import { locales as defaultLocales } from './locales'

import type {
	BirthLeaveForm,
} from './types/birthLeave'

pdfMake.addVirtualFileSystem(fonts)

/**
 * Couleurs provenant du formulaire d'origine.
 */
const COLORS = {
	employer: '#BDD7EE',
	employee: '#D9D9D9',
	header: '#5B9BD5',
	period: '#B1A0F3',
	white: '#FFFFFF',
	black: '#000000',
	red: '#FF0000',
}

/**
 * Largeurs communes des tableaux.
 */
const FIELD_WIDTHS = ['47%', '53%']

const PERIOD_WIDTHS = [
	'47%',
	'26.5%',
	'26.5%',
]

/**
 * Bordures communes des tableaux.
 */
const TABLE_LAYOUT = {
	hLineWidth: () => 0.5,
	vLineWidth: () => 0.5,
	hLineColor: () => COLORS.black,
	vLineColor: () => COLORS.black,
}

/**
 * Cellule utilisée pour les libellés.
 */
function labelCell(
	text: string,
	fillColor: string,
): TableCell {
	return {
		text,
		bold: true,
		fontSize: 8,
		fillColor,
		margin: [4, 5, 4, 5],
	}
}

/**
 * Cellule contenant une valeur du formulaire.
 */
function valueCell(
	value: string | undefined | null,
): TableCell {
	return {
		text: value || '',
		fontSize: 8,
		margin: [5, 5, 5, 5],
	}
}

/**
 * Ligne standard :
 *
 * Libellé | Valeur
 */
function fieldRow(
	label: string,
	value: string | undefined | null,
	color: string,
): TableCell[] {
	return [
		labelCell(label, color),
		valueCell(value),
	]
}

/**
 * Cellule d'en-tête des périodes.
 */
function headerCell(
	text: string,
): TableCell {
	return {
		text,
		bold: true,
		fontSize: 8,
		alignment: 'center',
		fillColor: COLORS.header,
		margin: [4, 5, 4, 5],
	}
}

/**
 * Cellule violette utilisée pour le libellé
 * d'une période.
 */
function periodLabelCell(
	text: string,
): TableCell {
	return {
		text,
		bold: true,
		fontSize: 8,
		fillColor: COLORS.period,
		margin: [4, 5, 4, 5],
	}
}

/**
 * Ligne d'une période :
 *
 * Période | Date début | Date fin
 */
function periodRow(
	label: string,
	start: string,
	end: string,
): TableCell[] {
	return [
		periodLabelCell(label),

		{
			text: formatFrenchDate(start),
			fontSize: 8,
			alignment: 'center',
			margin: [4, 5, 4, 5],
		},

		{
			text: formatFrenchDate(end),
			fontSize: 8,
			alignment: 'center',
			margin: [4, 5, 4, 5],
		},
	]
}

/**
 * Tableau standard à deux colonnes :
 *
 * Libellé | Valeur
 */
function fieldsTable(
	rows: TableCell[][],
	marginBottom = 15,
): Content {
	return {
		table: {
			widths: FIELD_WIDTHS,
			body: rows,
		},
		layout: TABLE_LAYOUT,
		margin: [0, 0, 0, marginBottom],
	}
}

/**
 * Tableau des périodes :
 *
 * Libellé | Début | Fin
 */
function periodsTable(
	rows: TableCell[][],
	marginBottom = 15,
): Content {
	return {
		table: {
			widths: PERIOD_WIDTHS,
			body: rows,
		},
		layout: TABLE_LAYOUT,
		margin: [0, 0, 0, marginBottom],
	}
}

/**
 * Création du PDF du congé de naissance.
 */
export function createBirthLeavePdfDefinition(
	form: BirthLeaveForm,
	locales = defaultLocales,
): TDocumentDefinitions {
	/*
	 * ==============================
	 * CALCUL DES PÉRIODES
	 * ==============================
	 */

	const continuous
		= form.leaveMode === 'continuous'

	/*
	 * Congé continu
	 */

	const firstStart
		= continuous
			? form.firstMonthStart
			: ''

	const firstEnd
		= calculateMonthEnd(firstStart)

	const secondStart
		= addOneDay(firstEnd)

	const secondEnd
		= calculateMonthEnd(secondStart)

	/*
	 * Congé fractionné
	 */

	const fractionalStart
		= continuous
			? ''
			: form.fractionalStart

	const fractionalEnd
		= calculateMonthEnd(fractionalStart)

	const fractionalLabel
		= !continuous
			&& form.fractionalPeriod
			? locales[form.fractionalPeriod]
			: ''

	/*
	 * ==============================
	 * CONTENU DU PDF
	 * ==============================
	 */

	const content: Content[] = [
		/*
		 * ==============================
		 * EN-TÊTE
		 * ==============================
		 */

		{
			table: {
				widths: [110, '*'],

				body: [
					[
						{
							svg: logo,
							width: 84,
							margin: [
								10,
								8,
								10,
								8,
							],
							fillColor:
								COLORS.employer,
						},

						{
							text: locales.title,
							bold: true,
							fontSize: 10,
							alignment: 'center',
							verticalAlignment:
								'middle',
							fillColor:
								COLORS.employer,
							margin: [
								10,
								15,
								10,
								15,
							],
						},
					],
				],
			},

			layout: TABLE_LAYOUT,

			margin: [0, 0, 0, 15],
		},

		/*
		 * ==============================
		 * DATE DE DÉCLARATION
		 * ==============================
		 */

		fieldsTable([
			fieldRow(
				locales.declarationDate,
				formatFrenchDate(
					form.declarationDate,
				),
				COLORS.white,
			),
		]),

		/*
		 * ==============================
		 * EMPLOYEUR
		 * ==============================
		 */

		fieldsTable([
			fieldRow(
				locales.employerName,
				form.employerName,
				COLORS.employer,
			),

			fieldRow(
				locales.siret,
				form.siret,
				COLORS.employer,
			),

			fieldRow(
				locales.employerContact,
				form.employerContact,
				COLORS.employer,
			),
		]),

		/*
		 * ==============================
		 * SALARIÉ + ENFANT
		 * ==============================
		 */

		fieldsTable([
			fieldRow(
				locales.socialSecurityNumber,
				form.socialSecurityNumber,
				COLORS.employee,
			),

			fieldRow(
				locales.employeeLastName,
				form.employeeLastName,
				COLORS.employee,
			),

			fieldRow(
				locales.employeeFirstName,
				form.employeeFirstName,
				COLORS.employee,
			),

			fieldRow(
				locales.childBirthDate,
				formatFrenchDate(
					form.childBirthDate,
				),
				COLORS.employee,
			),

			fieldRow(
				locales.childLastName,
				form.childLastName,
				COLORS.employee,
			),

			fieldRow(
				locales.childFirstName,
				form.childFirstName,
				COLORS.employee,
			),

			fieldRow(
				locales.secondChildFirstName,
				form.secondChildFirstName,
				COLORS.employee,
			),

			fieldRow(
				locales.thirdChildFirstName,
				form.thirdChildFirstName,
				COLORS.employee,
			),
		]),

		/*
		 * ==============================
		 * CONGÉ CONTINU
		 * ==============================
		 */

		periodsTable([
			[
				headerCell(
					locales.pdfContinuous,
				),

				headerCell(
					locales.pdfStart,
				),

				headerCell(
					locales.pdfEnd,
				),
			],

			periodRow(
				locales.pdfFirstMonth,
				firstStart,
				firstEnd,
			),

			periodRow(
				locales.pdfSecondMonth,
				secondStart,
				secondEnd,
			),
		]),

		/*
		 * ==============================
		 * CONGÉ FRACTIONNÉ
		 * ==============================
		 */

		periodsTable([
			[
				headerCell(
					locales.pdfFractional,
				),

				headerCell(
					locales.pdfStart,
				),

				headerCell(
					locales.pdfEnd,
				),
			],

			periodRow(
				fractionalLabel,
				fractionalStart,
				fractionalEnd,
			),
		]),

		/*
		 * ==============================
		 * CONGÉ CONVENTIONNEL
		 * ==============================
		 */

		periodsTable(
			[
				periodRow(
					locales.pdfConventional,
					form.conventionalLeaveStart,
					form.conventionalLeaveEnd,
				),
			],
			8,
		),

		/*
		 * ==============================
		 * INFORMATION
		 * ==============================
		 */

		{
			text: locales.conventionalNotice,
			fontSize: 8,
			margin: [
				3,
				0,
				3,
				20,
			],
		},

		/*
		 * ==============================
		 * MESSAGE NET-ENTREPRISES
		 * ==============================
		 */

		{
			text: locales.submissionNotice,
			fontSize: 10,
			bold: true,
			color: COLORS.red,
			margin: [
				3,
				0,
				3,
				0,
			],
		},
	]

	return {
		pageSize: 'A4',

		pageMargins: [
			52,
			54,
			52,
			40,
		],

		info: {
			title: locales.title,
		},

		content,

		defaultStyle: {
			font: 'Roboto',
			fontSize: 8,
		},
	}
}

/**
 * Génère et télécharge le PDF.
 */
export function generateBirthLeavePdf(
	form: BirthLeaveForm,
	locales = defaultLocales,
): void {
	const documentDefinition
		= createBirthLeavePdfDefinition(
			form,
			locales,
		)

	pdfMake
		.createPdf(documentDefinition)
		.download('conge-naissance.pdf')
}
