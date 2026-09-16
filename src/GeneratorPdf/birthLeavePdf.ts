import type { Content, ContentText, TDocumentDefinitions } from 'pdfmake/interfaces'
import logo from '@/assets/logos/logo-desktop.svg?raw'
import { addOneDay, calculateMonthEnd, formatFrenchDate } from './birthLeave'
import { locales as defaultLocales } from './locales'
import { downloadPdfDefinition } from './pdf'
import type { BirthLeaveForm } from './types/birthLeave'

/** Reproduit la page A4 du modèle « CSN Formulaire Employeurs phase 2 v3 ». */
export function createBirthLeavePdfDefinition(form: BirthLeaveForm, locales = defaultLocales): TDocumentDefinitions {
	const content: Content[] = []
	const left = 51.6
	const labelWidth = 230
	const pageWidth = 487
	const dateWidth = (pageWidth - labelWidth) / 2
	const rowHeight = 22.6
	const colors = { employer: '#BDD7EE', employee: '#D9D9D9', header: '#5B9BD5', period: '#B1A0F3' }

	function box(x: number, y: number, width: number, height: number, color: string) {
		content.push({
			canvas: [{ type: 'rect', x: 0, y: 0, w: width, h: height, color, lineColor: '#000000', lineWidth: 0.5 }],
			absolutePosition: { x, y },
		})
	}

	function text(value: ContentText['text'], x: number, y: number, width: number, bold = false, color = '#000000', fontSize = 8) {
		content.push({
			columns: [{ text: value, width, bold, color, fontSize, alignment: bold ? 'center' : 'left' }],
			absolutePosition: { x, y },
		})
	}

	function value(value: string, x: number, y: number, width: number) {
		// Adapte la taille des valeurs aux deux lignes disponibles.
		const fontSize = Math.min(9, (width * 1.8) / Math.max(value.length, 1))
		text(value, x, y + 4, width, false, '#000000', fontSize)
	}

	function field(label: string, fieldValue: string, y: number, color: string) {
		box(left, y, labelWidth, rowHeight, color)
		const labelText = locales.pdfNirKey && label === locales.socialSecurityNumber && label.endsWith(locales.pdfNirKey)
			? [{ text: label.slice(0, -locales.pdfNirKey.length) }, { text: locales.pdfNirKey, color: '#FF0000' }]
			: label
		text(labelText, left + 4, y + (label.length > 52 ? 2 : 6), labelWidth - 8, true)
		value(fieldValue, left + labelWidth + 7, y, pageWidth - labelWidth - 14)
	}

	function periodHeader(label: string, y: number) {
		box(left, y, labelWidth, rowHeight, colors.header)
		box(left + labelWidth, y, dateWidth, rowHeight, colors.header)
		box(left + labelWidth + dateWidth, y, dateWidth, rowHeight, colors.header)
		text(label, left + 4, y + 6, labelWidth - 8, true)
		text(locales.pdfStart, left + labelWidth, y + 6, dateWidth, true)
		text(locales.pdfEnd, left + labelWidth + dateWidth, y + 6, dateWidth, true)
	}

	function period(label: string, start: string, end: string, y: number, boxed = true) {
		if (boxed) box(left, y, labelWidth, rowHeight, colors.period)
		text(label, left + 4, y + 6, labelWidth - 8, boxed)
		value(formatFrenchDate(start), left + labelWidth + 7, y, dateWidth - 14)
		value(formatFrenchDate(end), left + labelWidth + dateWidth + 7, y, dateWidth - 14)
	}

	box(left, 54.5, pageWidth, 41, colors.employer)
	content.push({ svg: logo, width: 84, absolutePosition: { x: left + 7, y: 62 } })
	content.push({
		columns: [{ text: locales.title, width: 350, bold: true, fontSize: 8 }],
		absolutePosition: { x: 179.4, y: 71 },
	})
	field(locales.declarationDate, formatFrenchDate(form.declarationDate), 117.2, '#FFFFFF')

	field(locales.employerName, form.employerName, 161.3, colors.employer)
	field(locales.siret, form.siret, 189.6, colors.employer)
	field(locales.employerContact, form.employerContact, 217.9, colors.employer)

	field(locales.socialSecurityNumber, form.socialSecurityNumber, 262.1, colors.employee)
	field(locales.employeeLastName, form.employeeLastName, 290.4, colors.employee)
	field(locales.employeeFirstName, form.employeeFirstName, 318.7, colors.employee)
	field(locales.childBirthDate, formatFrenchDate(form.childBirthDate), 347, colors.employee)
	field(locales.childLastName, form.childLastName, 375.3, colors.employee)
	field(locales.childFirstName, form.childFirstName, 403.6, colors.employee)
	field(locales.secondChildFirstName, form.secondChildFirstName, 431.9, colors.employee)
	field(locales.thirdChildFirstName, form.thirdChildFirstName, 460.2, colors.employee)

	const continuous = form.leaveMode === 'continuous'
	const firstStart = continuous ? form.firstMonthStart : ''
	const firstEnd = calculateMonthEnd(firstStart)
	const secondStart = addOneDay(firstEnd)
	periodHeader(locales.pdfContinuous, 504.8)
	period(locales.pdfFirstMonth, firstStart, firstEnd, 533.1)
	period(locales.pdfSecondMonth, secondStart, calculateMonthEnd(secondStart), 561.4)

	const fractionalStart = continuous ? '' : form.fractionalStart
	const fractionalLabel = !continuous && form.fractionalPeriod ? locales[form.fractionalPeriod] : ''
	periodHeader(locales.pdfFractional, 605.6)
	period(fractionalLabel, fractionalStart, calculateMonthEnd(fractionalStart), 633.9, false)
	period(locales.pdfConventional, form.conventionalLeaveStart, form.conventionalLeaveEnd, 677.7)

	text(locales.conventionalNotice, left + 3, 716, pageWidth - 6, false, '#000000', 8)
	content.push({
		columns: [{ text: locales.submissionNotice, width: pageWidth - 6, fontSize: 10, color: '#FF0000', bold: true }],
		absolutePosition: { x: left + 3, y: 758 },
	})

	return {
		pageSize: 'A4',
		pageMargins: [0, 0, 0, 0],
		info: { title: locales.title },
		content,
		defaultStyle: { font: 'Roboto', fontSize: 8 },
	}
}

/** Télécharge la version remplie du formulaire phase 2. */
export async function generateBirthLeavePdf(form: BirthLeaveForm, locales = defaultLocales): Promise<void> {
	await downloadPdfDefinition(createBirthLeavePdfDefinition(form, locales), 'conge-naissance.pdf')
}
