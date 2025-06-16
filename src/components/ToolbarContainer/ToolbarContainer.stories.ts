import type { Meta, StoryObj } from '@storybook/vue3'
import Toolbar from './ToolbarContainer.vue'
import { VBtn, VCheckbox, VDivider } from 'vuetify/components'
import { mdiFormatAlignRight, mdiFormatAlignLeft, mdiFormatAlignCenter, mdiFormatAlignJustify, mdiFormatBold, mdiFormatItalic, mdiFormatUnderline, mdiFormatColorText, mdiFormatColorFill } from '@mdi/js'

const meta = {
	title: 'Composants/Layout/ToolbarContainer',
	component: Toolbar,
	argTypes: {
		default: {
			control: false,
			description: 'Contenu de la barre d\'outils',
		},
	},
} satisfies Meta<typeof Toolbar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	render: (args) => {
		return {
			components: { VBtn, Toolbar },
			setup() {
				return { args, mdiFormatAlignRight, mdiFormatAlignLeft, mdiFormatAlignCenter }
			},
			template: `
				<div>
					<Toolbar
						class="d-flex flex-wrap ga-4"
						aria-label="Outils de mise en forme"
					>
						<VBtn>
							<span class="d-sr-only">aligne a gauche</span>
							<VIcon
								size="x-large"
							>
								{{ mdiFormatAlignLeft }}
							</VIcon>
						</VBtn>
						<VBtn>
							<span class="d-sr-only">aligne au centre</span>
							<VIcon
								size="x-large"
							>
								{{ mdiFormatAlignCenter }}
							</VIcon>
						</VBtn>
						<VBtn>
							<span class="d-sr-only">aligne a droite</span>
							<VIcon
								size="x-large"
							>
								{{ mdiFormatAlignRight }}
							</VIcon>
						</VBtn>
					</Toolbar>
				</div>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
							<div>
								<Toolbar
									class="d-flex flex-wrap ga-4"
									aria-label="Outils de mise en forme"
								>
									<VBtn>
										<span class="d-sr-only">aligne a gauche</span>
										<VIcon
											size="x-large"
										>
											{{ mdiFormatAlignLeft }}
										</VIcon>
									</VBtn>
									<VBtn>
										<span class="d-sr-only">aligne au centre</span>
										<VIcon
											size="x-large"
										>
											{{ mdiFormatAlignCenter }}
										</VIcon>
									</VBtn>
									<VBtn>
										<span class="d-sr-only">aligne a droite</span>
										<VIcon
											size="x-large"
										>
											{{ mdiFormatAlignRight }}
										</VIcon>
									</VBtn>
								</Toolbar>
							</div>
						</tempalte>`,
			},
		],
	},
}

export const WithCheckboxes: Story = {
	render: (args) => {
		return {
			components: { VCheckbox, Toolbar },
			setup() {
				return { args }
			},
			template: `
				<Toolbar
					class="d-flex flex-wrap ga-4"
					aria-label="Options d'envoi"
				>
					<VCheckbox
						label="Envoyer une copie"
						color="primary"
					/>
					<VCheckbox
						label="Envoyer en copie cachée"
						color="primary"
					/>
					<VCheckbox
						label="Confirmer la lecture"
						color="primary"
					/>
				</Toolbar>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
					<Toolbar
						class="d-flex flex-wrap ga-4"
						aria-label="Options d'envoi"
					>
						<VCheckbox
							label="Envoyer une copie"
							color="primary"
						/>
						<VCheckbox
							label="Envoyer en copie cachée"
							color="primary"
						/>
						<VCheckbox
							label="Confirmer la lecture"
							color="primary"
						/>
					</Toolbar>
				</tempalte>`,
			},
		],
	},
}

export const ManyTables: Story = {
	render: (args) => {
		return {
			components: { VBtn, VDivider, Toolbar },
			setup() {
				return { args, mdiFormatAlignRight, mdiFormatAlignLeft, mdiFormatAlignCenter, mdiFormatAlignJustify, mdiFormatBold, mdiFormatItalic, mdiFormatUnderline, mdiFormatColorText, mdiFormatColorFill }
			},
			template: `
				<div class="d-flex flex-wrap ga-4">
					<Toolbar
						class="d-flex flex-wrap ga-4"
						aria-label="Outils d'alignement"
					>
						<VBtn
							title="ferrer à gauche"
						>
							<span class="d-sr-only">aligne a gauche</span>
							<VIcon
								size="x-large"
							>
								{{ mdiFormatAlignLeft }}
							</VIcon>
						</VBtn>
						<VBtn
							title="justifier"
						>
							<span class="d-sr-only">Texte justifié</span>
							<VIcon
								size="x-large"
							>
								{{ mdiFormatAlignJustify }}
							</VIcon>
						</VBtn>
						<VBtn
							title="centrer"
						>
							<span class="d-sr-only">aligne au centre</span>
							<VIcon
								size="x-large"
							>
								{{ mdiFormatAlignCenter }}
							</VIcon>
						</VBtn>
						<VBtn
							title="ferrer a droite"
						>
							<span class="d-sr-only">aligne à droite</span>
							<VIcon
								size="x-large"
							>
								{{ mdiFormatAlignRight }}
							</VIcon>
						</VBtn>
					</Toolbar>
					<VDivider
						:thickness="2"
						vertical
					/>
					<Toolbar
						class="d-flex flex-wrap ga-4"
						aria-label="Outils de mise en forme du texte"
					>
						<VBtn
							title="gras"
						>
							<span class="d-sr-only">Text gras</span>
							<VIcon
								size="x-large"
							>
								{{ mdiFormatBold }}
							</VIcon>
						</VBtn>
						<VBtn
							title="italique"
						>
							<span class="d-sr-only">Text italique</span>
							<VIcon
								size="x-large"
							>
								{{ mdiFormatItalic }}
							</VIcon>
						</VBtn>
						<VBtn
							title="souligné"
						>
							<span class="d-sr-only">Text souligné</span>
							<VIcon
								size="x-large"
							>
								{{ mdiFormatUnderline }}
							</VIcon>
						</VBtn>
					</Toolbar>
					<VDivider
						:thickness="2"
						vertical
					/>
					<Toolbar
						class="d-flex flex-wrap ga-4"
						aria-label="Outils de couleur"
					>
						<VBtn
							title="couleur"
						>
							<span class="d-sr-only">couleur du texte</span>
							<VIcon
								size="x-large"
							>
								{{ mdiFormatColorText }}
							</VIcon>
						</VBtn>
						<VBtn
							title="fond"
						>
							<span class="d-sr-only">Couleur de fond</span>
							<VIcon
								size="x-large"
							>
								{{ mdiFormatColorFill }}
							</VIcon>
						</VBtn>
					</Toolbar>
				</div>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
					<div class="d-flex flex-wrap ga-4">
						<Toolbar
							class="d-flex flex-wrap ga-4"
							aria-label="Outils d'alignement"
						>
							<VBtn
								title="ferrer à gauche"
							>
								<span class="d-sr-only">aligne a gauche</span>
								<VIcon
									size="x-large"
								>
									{{ mdiFormatAlignLeft }}
								</VIcon>
							</VBtn>
							<VBtn
								title="justifier"
							>
								<span class="d-sr-only">Texte justifié</span>
								<VIcon
									size="x-large"
								>
									{{ mdiFormatAlignJustify }}
								</VIcon>
							</VBtn>
							<VBtn
								title="centrer"
							>
								<span class="d-sr-only">aligne au centre</span>
								<VIcon
									size="x-large"
								>
									{{ mdiFormatAlignCenter }}
								</VIcon>
							</VBtn>
							<VBtn
								title="ferrer a droite"
							>
								<span class="d-sr-only">aligne à droite</span>
								<VIcon
									size="x-large"
								>
									{{ mdiFormatAlignRight }}
								</VIcon>
							</VBtn>
						</Toolbar>
						<VDivider
							:thickness="2"
							vertical
						/>
						<Toolbar
							class="d-flex flex-wrap ga-4"
							aria-label="Outils de mise en forme du texte"
						>
							<VBtn
								title="gras"
							>
								<span class="d-sr-only">Text gras</span>
								<VIcon
									size="x-large"
								>
									{{ mdiFormatBold }}
								</VIcon>
							</VBtn>
							<VBtn
								title="italique"
							>
								<span class="d-sr-only">Text italique</span>
								<VIcon
									size="x-large"
								>
									{{ mdiFormatItalic }}
								</VIcon>
							</VBtn>
							<VBtn
								title="souligné"
							>
								<span class="d-sr-only">Text souligné</span>
								<VIcon
									size="x-large"
								>
									{{ mdiFormatUnderline }}
								</VIcon>
							</VBtn>
						</Toolbar>
						<VDivider
							:thickness="2"
							vertical
						/>
						<Toolbar
							class="d-flex flex-wrap ga-4"
							aria-label="Outils de couleur"
						>
							<VBtn
								title="couleur"
							>
								<span class="d-sr-only">couleur du texte</span>
								<VIcon
									size="x-large"
								>
									{{ mdiFormatColorText }}
								</VIcon>
							</VBtn>
							<VBtn
								title="fond"
							>
								<span class="d-sr-only">Couleur de fond</span>
								<VIcon
									size="x-large"
								>
									{{ mdiFormatColorFill }}
								</VIcon>
							</VBtn>
						</Toolbar>
					</div>
				</template>`,
			},
		],
	},
}

export const Horizontal: Story = {
	render: (args) => {
		return {
			components: { VBtn, VDivider, Toolbar },
			setup() {
				return { args, mdiFormatAlignRight, mdiFormatAlignLeft, mdiFormatAlignCenter, mdiFormatAlignJustify, mdiFormatBold, mdiFormatItalic, mdiFormatUnderline, mdiFormatColorText, mdiFormatColorFill }
			},
			template: `
				<div class="d-flex flex-column flex-wrap ga-4" style="width: min-content;">
					<Toolbar
						class="d-flex flex-column flex-wrap ga-4"
						aria-label="Outils d'alignement"
						aria-orientation="vertical"
					>
						<VBtn
							title="ferrer à gauche"
						>
							<span class="d-sr-only">aligne a gauche</span>
							<VIcon
								size="x-large"
							>
								{{ mdiFormatAlignLeft }}
							</VIcon>
						</VBtn>
						<VBtn
							title="justifier"
						>
							<span class="d-sr-only">Texte justifié</span>
							<VIcon
								size="x-large"
							>
								{{ mdiFormatAlignJustify }}
							</VIcon>
						</VBtn>
						<VBtn
							title="centrer"
						>
							<span class="d-sr-only">aligne au centre</span>
							<VIcon
								size="x-large"
							>
								{{ mdiFormatAlignCenter }}
							</VIcon>
						</VBtn>
						<VBtn
							title="ferrer a droite"
						>
							<span class="d-sr-only">aligne à droite</span>
							<VIcon
								size="x-large"
							>
								{{ mdiFormatAlignRight }}
							</VIcon>
						</VBtn>
					</Toolbar>
					<VDivider
						:thickness="2"
						horizontal
					/>
					<Toolbar
						class="d-flex flex-column flex-wrap ga-4"
						aria-label="Outils de mise en forme du texte"
						aria-orientation="vertical"
					>
						<VBtn
							title="gras"
						>
							<span class="d-sr-only">Text gras</span>
							<VIcon
								size="x-large"
							>
								{{ mdiFormatBold }}
							</VIcon>
						</VBtn>
						<VBtn
							title="italique"
						>
							<span class="d-sr-only">Text italique</span>
							<VIcon
								size="x-large"
							>
								{{ mdiFormatItalic }}
							</VIcon>
						</VBtn>
						<VBtn
							title="souligné"
						>
							<span class="d-sr-only">Text souligné</span>
							<VIcon
								size="x-large"
							>
								{{ mdiFormatUnderline }}
							</VIcon>
						</VBtn>
					</Toolbar>
					<VDivider
						:thickness="2"
						horizontal
					/>
					<Toolbar
						class="d-flex flex-column flex-wrap ga-4"
						aria-label="Outils de couleur"
						aria-orientation="vertical"
					>
						<VBtn
							title="couleur"
						>
							<span class="d-sr-only">couleur du texte</span>
							<VIcon
								size="x-large"
							>
								{{ mdiFormatColorText }}
							</VIcon>
						</VBtn>
						<VBtn
							title="fond"
						>
							<span class="d-sr-only">Couleur de fond</span>
							<VIcon
								size="x-large"
							>
								{{ mdiFormatColorFill }}
							</VIcon>
						</VBtn>
					</Toolbar>
				</div>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
					<div class="d-flex flex-column flex-wrap ga-4" style="width: min-content;">
						<Toolbar
							class="d-flex flex-column flex-wrap ga-4"
							aria-label="Outils d'alignement"
							aria-orientation="vertical"
						>
							<VBtn
								title="ferrer à gauche"
							>
								<span class="d-sr-only">aligne a gauche</span>
								<VIcon
									size="x-large"
								>
									{{ mdiFormatAlignLeft }}
								</VIcon>
							</VBtn>
							<VBtn
								title="justifier"
							>
								<span class="d-sr-only">Texte justifié</span>
								<VIcon
									size="x-large"
								>
									{{ mdiFormatAlignJustify }}
								</VIcon>
							</VBtn>
							<VBtn
								title="centrer"
							>
								<span class="d-sr-only">aligne au centre</span>
								<VIcon
									size="x-large"
								>
									{{ mdiFormatAlignCenter }}
								</VIcon>
							</VBtn>
							<VBtn
								title="ferrer a droite"
							>
								<span class="d-sr-only">aligne à droite</span>
								<VIcon
									size="x-large"
								>
									{{ mdiFormatAlignRight }}
								</VIcon>
							</VBtn>
						</Toolbar>
						<VDivider
							:thickness="2"
							horizontal
						/>
						<Toolbar
							class="d-flex flex-column flex-wrap ga-4"
							aria-label="Outils de mise en forme du texte"
							aria-orientation="vertical"
						>
							<VBtn
								title="gras"
							>
								<span class="d-sr-only">Text gras</span>
								<VIcon
									size="x-large"
								>
									{{ mdiFormatBold }}
								</VIcon>
							</VBtn>
							<VBtn
								title="italique"
							>
								<span class="d-sr-only">Text italique</span>
								<VIcon
									size="x-large"
								>
									{{ mdiFormatItalic }}
								</VIcon>
							</VBtn>
							<VBtn
								title="souligné"
							>
								<span class="d-sr-only">Text souligné</span>
								<VIcon
									size="x-large"
								>
									{{ mdiFormatUnderline }}
								</VIcon>
							</VBtn>
						</Toolbar>
						<VDivider
							:thickness="2"
							horizontal
						/>
						<Toolbar
							class="d-flex flex-column flex-wrap ga-4"
							aria-label="Outils de couleur"
							aria-orientation="vertical"
						>
							<VBtn
								title="couleur"
							>
								<span class="d-sr-only">couleur du texte</span>
								<VIcon
									size="x-large"
								>
									{{ mdiFormatColorText }}
								</VIcon>
							</VBtn>
							<VBtn
								title="fond"
							>
								<span class="d-sr-only">Couleur de fond</span>
								<VIcon
									size="x-large"
								>
									{{ mdiFormatColorFill }}
								</VIcon>
							</VBtn>
						</Toolbar>
					</div>
				</template>`,
			},
		],
	},
}
