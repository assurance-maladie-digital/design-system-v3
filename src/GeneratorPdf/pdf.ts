import type { Content, TDocumentDefinitions } from 'pdfmake/interfaces'
import { locales as defaultLocales } from './locales'
import type { PdfOptions, PdfValue } from './types/pdf'

/** Prépare la mise en page qui sera ensuite transmise à pdfmake. */
export function createPdfDefinition(options: PdfOptions, locales = defaultLocales): TDocumentDefinitions {
	function formatValue(value: PdfValue): string {
		if (value === '' || value == null) return locales.missing
		if (typeof value === 'boolean') return value ? locales.yes : locales.no
		return String(value)
	}

	const content: Content[] = [{ text: options.title, fontSize: 18, bold: true, margin: [0, 0, 0, 20] }]
	for (const section of options.sections) {
		const rows = Object.entries(section.values)
		if (!rows.length) continue
		if (section.title) {
			content.push({ text: section.title, fontSize: 13, bold: true, margin: [0, 10, 0, 8] })
		}
		content.push({
			table: {
				widths: ['45%', '*'],
				dontBreakRows: true,
				body: rows.map(([label, value]) => [{ text: label, bold: true }, { text: formatValue(value) }]),
			},
			layout: 'lightHorizontalLines',
			margin: [0, 0, 0, 12],
		})
	}
	return {
		pageSize: 'A4',
		pageMargins: [40, 40, 40, 40],
		info: { title: options.title },
		content,
		defaultStyle: { fontSize: 10 },
	}
}

/** Télécharge le PDF côté client ; les polices sont embarquées, sans requête distante. */
export async function generatePdf(options: PdfOptions, locales = defaultLocales): Promise<void> {
	await downloadPdfDefinition(createPdfDefinition(options, locales), options.filename ?? 'formulaire.pdf')
}

/** Télécharge une mise en page dédiée avec les mêmes polices embarquées. */
export async function downloadPdfDefinition(definition: TDocumentDefinitions, filename: string): Promise<void> {
	if (typeof window === 'undefined') return
	const pdfMake = (await import('pdfmake/build/pdfmake')).default
	const fonts = (await import('pdfmake/build/vfs_fonts')).default

	pdfMake.addVirtualFileSystem(fonts)
	await pdfMake.createPdf(definition).download(filename)
}
