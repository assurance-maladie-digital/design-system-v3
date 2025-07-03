import type { Meta, StoryObj } from '@storybook/vue3'
import { computed } from 'vue'
// Import Vue component with proper type declaration from vue-shims.d.ts
import TypographyDisplay from './TypographyDisplay.vue'
import { cnamFontsTokens } from '@/designTokens/tokens/cnam/cnamFonts'
import { paFontsTokens } from '@/designTokens/tokens/pa/paFonts'

const meta: Meta = {
	title: 'Design Tokens/Styles typographiques',
	component: TypographyDisplay,
}

export default meta

export const Introduction: StoryObj = {
	render: () => {
		return {
			setup() {
				const theme = computed(() => typeof window !== 'undefined' ? localStorage.getItem('storybook-theme') : 'cnam')
				return {
					theme,
					cnamFontFamily: cnamFontsTokens.family.primary,
					paFontFamily: paFontsTokens.family.primary,
				}
			},
			template: `
				<p style="font-size: 14px; margin: 16px 0; line-height: 24px; color: rgb(46, 52, 56);">
					Les styles typographiques sont un élément essentiel de notre système de design. Ils permettent de créer une hiérarchie visuelle claire et cohérente dans nos interfaces.
				</p>
				<p style="font-size: 14px; margin: 16px 0; line-height: 24px; color: rgb(46, 52, 56);">
					Notre système typographique utilise la police {{ theme === 'cnam' ? cnamFontFamily : paFontFamily }} pour tous les éléments textuels, avec différentes tailles et graisses pour créer une hiérarchie visuelle claire.
				</p>
			`,
		}
	},
	tags: ['!dev'],
}

export const HeadingStyles: StoryObj = {
	render: () => {
		return {
			components: { TypographyDisplay },
			setup() {
				const cnamTypography = {
					h1: {
						fontFamily: cnamFontsTokens.heading.h1.fontFamily,
						fontSize: cnamFontsTokens.heading.h1.fontSize,
						fontWeight: cnamFontsTokens.heading.h1.fontWeight,
						lineHeight: `${cnamFontsTokens.heading.h1.lineHeight}`,
						sample: 'Titre de niveau 1',
						description: 'Utilisé pour les titres principaux de page',
					},
					h2: {
						fontFamily: cnamFontsTokens.heading.h2.fontFamily,
						fontSize: cnamFontsTokens.heading.h2.fontSize,
						fontWeight: cnamFontsTokens.heading.h2.fontWeight,
						lineHeight: `${cnamFontsTokens.heading.h2.lineHeight}`,
						sample: 'Titre de niveau 2',
						description: 'Utilisé pour les sections principales',
					},
					h3: {
						fontFamily: cnamFontsTokens.heading.h3.fontFamily,
						fontSize: cnamFontsTokens.heading.h3.fontSize,
						fontWeight: cnamFontsTokens.heading.h3.fontWeight,
						lineHeight: `${cnamFontsTokens.heading.h3.lineHeight}`,
						sample: 'Titre de niveau 3',
						description: 'Utilisé pour les sous-sections',
					},
					h4: {
						fontFamily: cnamFontsTokens.heading.h4.fontFamily,
						fontSize: cnamFontsTokens.heading.h4.fontSize,
						fontWeight: cnamFontsTokens.heading.h4.fontWeight,
						lineHeight: `${cnamFontsTokens.heading.h4.lineHeight}`,
						sample: 'Titre de niveau 4',
						description: 'Utilisé pour les composants importants',
					},
					h5: {
						fontFamily: cnamFontsTokens.heading.h5.fontFamily,
						fontSize: cnamFontsTokens.heading.h5.fontSize,
						fontWeight: cnamFontsTokens.heading.h5.fontWeight,
						lineHeight: `${cnamFontsTokens.heading.h5.lineHeight}`,
						sample: 'Titre de niveau 5',
						description: 'Utilisé pour les éléments secondaires',
					},
					h6: {
						fontFamily: cnamFontsTokens.heading.h6.fontFamily,
						fontSize: cnamFontsTokens.heading.h6.fontSize,
						fontWeight: cnamFontsTokens.heading.h6.fontWeight,
						lineHeight: `${cnamFontsTokens.heading.h6.lineHeight}`,
						sample: 'Titre de niveau 6',
						description: 'Utilisé pour les éléments tertiaires',
					},
				}
				const paTypography = {
					h1: {
						fontFamily: paFontsTokens.heading.h1.fontFamily,
						fontSize: paFontsTokens.heading.h1.fontSize,
						fontWeight: paFontsTokens.heading.h1.fontWeight,
						lineHeight: `${paFontsTokens.heading.h1.lineHeight}`,
						sample: 'Titre de niveau 1',
						description: 'Utilisé pour les titres principaux de page',
					},
					h2: {
						fontFamily: paFontsTokens.heading.h2.fontFamily,
						fontSize: paFontsTokens.heading.h2.fontSize,
						fontWeight: paFontsTokens.heading.h2.fontWeight,
						lineHeight: `${paFontsTokens.heading.h2.lineHeight}`,
						sample: 'Titre de niveau 2',
						description: 'Utilisé pour les sections principales',
					},
					h3: {
						fontFamily: paFontsTokens.heading.h3.fontFamily,
						fontSize: paFontsTokens.heading.h3.fontSize,
						fontWeight: paFontsTokens.heading.h3.fontWeight,
						lineHeight: `${paFontsTokens.heading.h3.lineHeight}`,
						sample: 'Titre de niveau 3',
						description: 'Utilisé pour les sous-sections',
					},
					h4: {
						fontFamily: paFontsTokens.heading.h4.fontFamily,
						fontSize: paFontsTokens.heading.h4.fontSize,
						fontWeight: paFontsTokens.heading.h4.fontWeight,
						lineHeight: `${paFontsTokens.heading.h4.lineHeight}`,
						sample: 'Titre de niveau 4',
						description: 'Utilisé pour les composants importants',
					},
					h5: {
						fontFamily: paFontsTokens.heading.h5.fontFamily,
						fontSize: paFontsTokens.heading.h5.fontSize,
						fontWeight: paFontsTokens.heading.h5.fontWeight,
						lineHeight: `${paFontsTokens.heading.h5.lineHeight}`,
						sample: 'Titre de niveau 5',
						description: 'Utilisé pour les éléments secondaires',
					},
					h6: {
						fontFamily: paFontsTokens.heading.h6.fontFamily,
						fontSize: paFontsTokens.heading.h6.fontSize,
						fontWeight: paFontsTokens.heading.h6.fontWeight,
						lineHeight: `${paFontsTokens.heading.h6.lineHeight}`,
						sample: 'Titre de niveau 6',
						description: 'Utilisé pour les éléments tertiaires',
					},
				}
				return {
					cnamTypography,
					paTypography,
				}
			},
			template: `
				<TypographyDisplay 
					typographyCategory="headings" 
					:cnamTypography="cnamTypography" 
					:paTypography="paTypography" 
				/>
			`,
		}
	},
	tags: ['!dev'],
}

export const DisplayHeadingStyles: StoryObj = {
	render: () => {
		return {
			components: { TypographyDisplay },
			setup() {
				const cnamTypography = {
					'display-1': {
						fontFamily: cnamFontsTokens.display.display1.fontFamily,
						fontSize: cnamFontsTokens.display.display1.fontSize,
						fontWeight: cnamFontsTokens.display.display1.fontWeight,
						lineHeight: `${cnamFontsTokens.display.display1.lineHeight}`,
						sample: 'Display 1',
						description: 'Pour les mises en avant principales',
					},
					'display-2': {
						fontFamily: cnamFontsTokens.display.display2.fontFamily,
						fontSize: cnamFontsTokens.display.display2.fontSize,
						fontWeight: cnamFontsTokens.display.display2.fontWeight,
						lineHeight: `${cnamFontsTokens.display.display2.lineHeight}`,
						sample: 'Display 2',
						description: 'Pour les bannières et sections importantes',
					},
				}
				const paTypography = {
					'display-1': {
						fontFamily: paFontsTokens.display?.display1?.fontFamily || paFontsTokens.family.primary,
						fontSize: paFontsTokens.display?.display1?.fontSize || '2.5rem',
						fontWeight: paFontsTokens.display?.display1?.fontWeight || 300,
						lineHeight: `${paFontsTokens.display?.display1?.lineHeight || 1.2}`,
						sample: 'Display 1',
						description: 'Pour les mises en avant principales',
					},
					'display-2': {
						fontFamily: paFontsTokens.display?.display2?.fontFamily || paFontsTokens.family.primary,
						fontSize: paFontsTokens.display?.display2?.fontSize || '1.875rem',
						fontWeight: paFontsTokens.display?.display2?.fontWeight || 300,
						lineHeight: `${paFontsTokens.display?.display2?.lineHeight || 1.1}`,
						sample: 'Display 2',
						description: 'Pour les bannières et sections importantes',
					},
				}
				return {
					cnamTypography,
					paTypography,
				}
			},
			template: `
				<TypographyDisplay 
					typographyCategory="display-headings" 
					:cnamTypography="cnamTypography" 
					:paTypography="paTypography" 
				/>
			`,
		}
	},
	tags: ['!dev'],
}

export const BodyTextStyles: StoryObj = {
	render: () => {
		return {
			components: { TypographyDisplay },
			setup() {
				const cnamTypography = {
					'body-lg': {
						fontFamily: cnamFontsTokens.body.body1.fontFamily,
						fontSize: cnamFontsTokens.body.body1.fontSize,
						fontWeight: cnamFontsTokens.body.body1.fontWeight,
						lineHeight: `${cnamFontsTokens.body.body1.lineHeight}`,
						sample: 'Texte corps large',
						description: 'Pour les paragraphes importants et introductions',
					},
					'body': {
						fontFamily: cnamFontsTokens.body.body2.fontFamily,
						fontSize: cnamFontsTokens.body.body2.fontSize,
						fontWeight: cnamFontsTokens.body.body2.fontWeight,
						lineHeight: `${cnamFontsTokens.body.body2.lineHeight}`,
						sample: 'Texte corps standard',
						description: 'Pour le contenu principal des pages',
					},
					'body-sm': {
						fontFamily: cnamFontsTokens.caption.fontFamily,
						fontSize: cnamFontsTokens.caption.fontSize,
						fontWeight: cnamFontsTokens.caption.fontWeight,
						lineHeight: `${cnamFontsTokens.caption.lineHeight}`,
						sample: 'Texte corps petit',
						description: 'Pour les informations secondaires',
					},
					'body-xs': {
						fontFamily: cnamFontsTokens.family.primary,
						fontSize: cnamFontsTokens.size.xs,
						fontWeight: cnamFontsTokens.weight.regular,
						lineHeight: `${cnamFontsTokens.lineHeight.normal}`,
						sample: 'Texte corps très petit',
						description: 'Pour les mentions légales et notes de bas de page',
					},
				}
				const paTypography = {
					'body-lg': {
						fontFamily: paFontsTokens.body?.body1?.fontFamily || paFontsTokens.family.primary,
						fontSize: paFontsTokens.body?.body1?.fontSize || '1.125rem',
						fontWeight: paFontsTokens.body?.body1?.fontWeight || 400,
						lineHeight: `${paFontsTokens.body?.body1?.lineHeight || 1.5}`,
						sample: 'Texte corps large',
						description: 'Pour les paragraphes importants et introductions',
					},
					'body': {
						fontFamily: paFontsTokens.body?.body2?.fontFamily || paFontsTokens.family.primary,
						fontSize: paFontsTokens.body?.body2?.fontSize || '1rem',
						fontWeight: paFontsTokens.body?.body2?.fontWeight || 400,
						lineHeight: `${paFontsTokens.body?.body2?.lineHeight || 1.5}`,
						sample: 'Texte corps standard',
						description: 'Pour le contenu principal des pages',
					},
					'body-sm': {
						fontFamily: paFontsTokens.caption?.fontFamily || paFontsTokens.family.primary,
						fontSize: paFontsTokens.caption?.fontSize || '0.875rem',
						fontWeight: paFontsTokens.caption?.fontWeight || 400,
						lineHeight: `${paFontsTokens.caption?.lineHeight || 1.5}`,
						sample: 'Texte corps petit',
						description: 'Pour les informations secondaires',
					},
					'body-xs': {
						fontFamily: paFontsTokens.family.primary,
						fontSize: paFontsTokens.size.xs,
						fontWeight: paFontsTokens.weight.regular,
						lineHeight: `${paFontsTokens.lineHeight.normal}`,
						sample: 'Texte corps très petit',
						description: 'Pour les mentions légales et notes de bas de page',
					},
				}
				return {
					cnamTypography,
					paTypography,
				}
			},
			template: `
				<TypographyDisplay 
					typographyCategory="body-text" 
					:cnamTypography="cnamTypography" 
					:paTypography="paTypography" 
				/>
			`,
		}
	},
	tags: ['!dev'],
}

export const LinksAndLabels: StoryObj = {
	render: () => {
		return {
			components: { TypographyDisplay },
			setup() {
				const cnamTypography = {
					link: {
						fontFamily: cnamFontsTokens.family.primary,
						fontSize: cnamFontsTokens.size.base,
						fontWeight: cnamFontsTokens.weight.medium,
						lineHeight: `${cnamFontsTokens.lineHeight.normal}`,
						sample: 'Lien textuel',
						description: 'Pour les liens dans le texte',
					},
					label: {
						fontFamily: cnamFontsTokens.family.primary,
						fontSize: cnamFontsTokens.size.sm,
						fontWeight: cnamFontsTokens.weight.medium,
						lineHeight: `${cnamFontsTokens.lineHeight.normal}`,
						sample: 'Label',
						description: 'Pour les étiquettes et badges',
					},
					button: {
						fontFamily: cnamFontsTokens.family.primary,
						fontSize: cnamFontsTokens.size.base,
						fontWeight: cnamFontsTokens.weight.medium,
						lineHeight: `${cnamFontsTokens.lineHeight.normal}`,
						sample: 'Bouton',
						description: 'Pour le texte des boutons',
					},
					caption: {
						fontFamily: cnamFontsTokens.caption.fontFamily,
						fontSize: cnamFontsTokens.caption.fontSize,
						fontWeight: cnamFontsTokens.caption.fontWeight,
						lineHeight: `${cnamFontsTokens.caption.lineHeight}`,
						sample: 'Légende',
						description: 'Pour les légendes et notes en petit',
					},
				}
				const paTypography = {
					link: {
						fontFamily: paFontsTokens.family.primary,
						fontSize: paFontsTokens.size.base,
						fontWeight: paFontsTokens.weight.medium,
						lineHeight: `${paFontsTokens.lineHeight.normal}`,
						sample: 'Lien textuel',
						description: 'Pour les liens dans le texte',
					},
					label: {
						fontFamily: paFontsTokens.family.primary,
						fontSize: paFontsTokens.size.sm,
						fontWeight: paFontsTokens.weight.medium,
						lineHeight: `${paFontsTokens.lineHeight.normal}`,
						sample: 'Label',
						description: 'Pour les étiquettes et badges',
					},
					button: {
						fontFamily: paFontsTokens.family.primary,
						fontSize: paFontsTokens.size.base,
						fontWeight: paFontsTokens.weight.medium,
						lineHeight: `${paFontsTokens.lineHeight.normal}`,
						sample: 'Bouton',
						description: 'Pour le texte des boutons',
					},
					caption: {
						fontFamily: paFontsTokens.caption?.fontFamily || paFontsTokens.family.primary,
						fontSize: paFontsTokens.caption?.fontSize || '0.75rem',
						fontWeight: paFontsTokens.caption?.fontWeight || 400,
						lineHeight: `${paFontsTokens.caption?.lineHeight || 1.5}`,
						sample: 'Légende',
						description: 'Pour les légendes et notes en petit',
					},
				}
				return {
					cnamTypography,
					paTypography,
				}
			},
			template: `
				<TypographyDisplay 
					typographyCategory="links-and-labels" 
					:cnamTypography="cnamTypography" 
					:paTypography="paTypography" 
				/>
			`,
		}
	},
	tags: ['!dev'],
}
