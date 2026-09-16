/** Valeur imprimable dans une ligne du PDF. */
export type PdfValue = string | number | boolean | null | undefined

/** Section de paires libellé / valeur. */
export interface PdfSection {
	title?: string
	values: Record<string, PdfValue>
}

/** Contenu et nom du document à télécharger. */
export interface PdfOptions {
	title: string
	filename?: string
	sections: PdfSection[]
}
