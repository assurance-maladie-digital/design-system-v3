/** Marques disponibles : chaque marque correspond à un thème Vuetify de Synapse. */
export type SynapseBrand = 'cnam' | 'pa' | 'ap' | 'ap2026'

/** Style visuel des champs de formulaire (prop `variant` des champs Vuetify). */
export type SynapseFieldVariant = 'outlined' | 'filled' | 'underlined'

/** Densité des champs de formulaire (prop `density` des champs Vuetify). */
export type SynapseFieldDensity = 'default' | 'comfortable' | 'compact'

/** Couleurs autorisées pour le ring de focus (clé de couleur du thème, camelCase). */
export type SynapseFocusColor = 'primary' | 'pinkDarken20'

/** Réglages du ring de focus clavier. */
export interface SynapseFocusConfig {
	/** Épaisseur du ring, en pixels. Minimum 2 (RGAA / WCAG 2.4.13). */
	width: number
	/** Écart entre l'élément et le ring, en pixels. */
	offset: number
	/** Couleur du ring : `primary` ou `pinkDarken20`. */
	color: SynapseFocusColor
}

/** Réglages des champs de formulaire. */
export interface SynapseFieldsConfig {
	variant: SynapseFieldVariant
	density: SynapseFieldDensity
}

/** Configuration de thème complète, après fusion avec les valeurs par défaut. */
export interface SynapseThemeConfig {
	brand: SynapseBrand
	focus: SynapseFocusConfig
	fields: SynapseFieldsConfig
}

/** Configuration de thème fournie par un projet : chaque réglage est optionnel. */
export interface SynapseThemeConfigInput {
	brand?: SynapseBrand
	focus?: Partial<SynapseFocusConfig>
	fields?: Partial<SynapseFieldsConfig>
}

export type ThemeConfigIssueLevel = 'error' | 'warning'

export interface ThemeConfigIssue {
	level: ThemeConfigIssueLevel
	/** Chemin du réglage concerné, ex. `focus.width`. */
	path: string
	message: string
}

export interface ThemeConfigValidationResult {
	valid: boolean
	issues: ThemeConfigIssue[]
}
