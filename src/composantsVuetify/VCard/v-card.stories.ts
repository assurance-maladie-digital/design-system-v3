import type { Meta, StoryObj } from '@storybook/vue3'
import { VCard, VCardTitle, VCardText, VCardActions } from 'vuetify/components'
import { VBtn } from 'vuetify/components'

const meta: Meta<typeof VCard> = {
	title: 'Composants/Composants Vuetify/VCard',
	tags: ['!dev'],
	component: VCard,
	parameters: {
		docs: {
			source: {
				transform: (src: string) => {
					// Extract only the template part
					const templateMatch = src.match(/template:\s*`([\s\S]*?)`/)
					if (templateMatch && templateMatch[1]) {
						return templateMatch[1]
							.trim()
							.replace(/<VCard/g, '<v-card')
							.replace(/<\/VCard>/g, '</v-card>')
							.replace(/<VCardTitle/g, '<v-card-title')
							.replace(/<\/VCardTitle>/g, '</v-card-title>')
							.replace(/<VCardText/g, '<v-card-text')
							.replace(/<\/VCardText>/g, '</v-card-text>')
							.replace(/<VCardActions/g, '<v-card-actions')
							.replace(/<\/VCardActions>/g, '</v-card-actions>')
							.replace(/<VBtn/g, '<v-btn')
							.replace(/<\/VBtn>/g, '</v-btn>')
					}
					return src
				},
			},
		},
	},
	argTypes: {
		color: {
			control: { type: 'text' },
			description: 'Couleur de la carte',
		},
		variant: {
			control: { type: 'select' },
			options: ['elevated', 'flat', 'tonal', 'outlined', 'text', 'plain'],
			description: 'Variante de style de la carte',
		},
		elevation: {
			control: { type: 'number' },
			description: 'Élévation de la carte (ombre)',
		},
		disabled: {
			control: { type: 'boolean' },
			description: 'Désactive la carte',
		},
		loading: {
			control: { type: 'boolean' },
			description: 'Affiche un état de chargement',
		},
		rounded: {
			control: { type: 'select' },
			options: ['0', 'sm', 'md', 'lg', 'xl', 'pill', 'circle'],
			description: 'Arrondi des coins de la carte',
		},
	},
}

export default meta

type Story = StoryObj<typeof VCard>

export const Primary: Story = {
	render: args => ({
		components: { VCard, VCardTitle, VCardText },
		setup() {
			return { args }
		},
		template: `
            <VCard v-bind="args" style="max-width: 400px;">
                <VCardTitle>Carte Primary</VCardTitle>
                <VCardText>
                    Cette carte utilise la couleur "primary".
                </VCardText>
            </VCard>
        `,
	}),
	args: {
		color: 'primary',
	},
	parameters: {
		docs: {
			source: {
				code: `<v-card color="primary" style="max-width: 400px;">
    <v-card-title>Carte Primary</v-card-title>
    <v-card-text>
        Cette carte utilise la couleur "primary".
    </v-card-text>
</v-card>`,
			},
		},
	},
}

export const PrimaryTonal: Story = {
	render: args => ({
		components: { VCard, VCardTitle, VCardText },
		setup() {
			return { args }
		},
		template: `
            <VCard v-bind="args" style="max-width: 400px;">
                <VCardTitle>Carte Primary Tonal</VCardTitle>
                <VCardText>
                    Cette carte utilise la couleur "primary" et la variant "tonal".
                </VCardText>
            </VCard>
        `,
	}),
	args: {
		color: 'primary',
		variant: 'tonal',
	},
	parameters: {
		docs: {
			source: {
				code: `<v-card color="primary" variant="tonal" style="max-width: 400px;">
    <v-card-title>Carte Primary Tonal</v-card-title>
    <v-card-text>
        Cette carte utilise la couleur "primary" et la variant "tonal".
    </v-card-text>
</v-card>`,
			},
		},
	},
}

export const PrimaryElevated: Story = {
	render: args => ({
		components: { VCard, VCardTitle, VCardText },
		setup() {
			return { args }
		},
		template: `
            <VCard v-bind="args" style="max-width: 400px;">
                <VCardTitle>Carte Primary Elevated</VCardTitle>
                <VCardText>
                    Cette carte utilise la couleur "primary" et la variant "elevated".
                </VCardText>
            </VCard>
        `,
	}),
	args: {
		color: 'primary',
		variant: 'elevated',
		elevation: 4,
	},
	parameters: {
		docs: {
			source: {
				code: `<v-card color="primary" variant="elevated" :elevation="4" style="max-width: 400px;">
    <v-card-title>Carte Primary Elevated</v-card-title>
    <v-card-text>
        Cette carte utilise la couleur "primary" et la variant "elevated".
    </v-card-text>
</v-card>`,
			},
		},
	},
}

export const PrimaryOutlined: Story = {
	render: args => ({
		components: { VCard, VCardTitle, VCardText, VCardActions, VBtn },
		setup() {
			return { args }
		},
		template: `
            <VCard v-bind="args" style="max-width: 400px;">
                <VCardTitle>Carte Primary Outlined</VCardTitle>
                <VCardText>
                    Cette carte utilise la couleur "primary" et la variant "outlined". Elle contient également des boutons d'action.
                </VCardText>
                <VCardActions class="justify-end">
                  <VBtn variant="text" color="primary">Annuler</VBtn>
                  <VBtn variant="tonal" color="primary">Confirmer</VBtn>
                </VCardActions>
            </VCard>
        `,
	}),
	args: {
		color: 'primary',
		variant: 'outlined',
	},
	parameters: {
		docs: {
			source: {
				code: `<v-card color="primary" variant="outlined" style="max-width: 400px;">
    <v-card-title>Carte Primary Outlined</v-card-title>
    <v-card-text>
        Cette carte utilise la couleur "primary" et la variant "outlined". Elle contient également des boutons d'action.
    </v-card-text>
    <v-card-actions class="justify-end">
        <v-btn variant="text" color="primary">Annuler</v-btn>
        <v-btn variant="tonal" color="primary">Confirmer</v-btn>
    </v-card-actions>
</v-card>`,
			},
		},
	},
}

// États

export const Loading: Story = {
	render: args => ({
		components: { VCard, VCardTitle, VCardText },
		setup() {
			return { args }
		},
		template: `
            <VCard v-bind="args" style="max-width: 400px;">
                <VCardTitle>Carte Primary en chargement</VCardTitle>
                <VCardText>
                    Cette carte utilise la couleur "primary" et affiche un état de chargement.
                </VCardText>
            </VCard>
        `,
	}),
	args: {
		loading: true,
		color: 'primary',
	},
	parameters: {
		docs: {
			source: {
				code: `<v-card :loading="true" color="primary" style="max-width: 400px;">
    <v-card-title>Carte Primary en chargement</v-card-title>
    <v-card-text>
        Cette carte utilise la couleur "primary" et affiche un état de chargement.
    </v-card-text>
</v-card>`,
			},
		},
	},
}

export const Disabled: Story = {
	render: args => ({
		components: { VCard, VCardTitle, VCardText, VCardActions, VBtn },
		setup() {
			return { args }
		},
		template: `
            <VCard v-bind="args" style="max-width: 400px;">
                <VCardTitle>Carte désactivée</VCardTitle>
                <VCardText>
                    Cette carte est désactivée.
                </VCardText>
                <VCardActions class="justify-end">
                    <VBtn>Action</VBtn>
                </VCardActions>
            </VCard>
        `,
	}),
	args: {
		disabled: true,
	},
	parameters: {
		docs: {
			source: {
				code: `<v-card :disabled="true" style="max-width: 400px;">
    <v-card-title>Carte désactivée</v-card-title>
    <v-card-text>
        Cette carte est désactivée.
    </v-card-text>
    <v-card-actions class="justify-end">
        <v-btn>Action</v-btn>
    </v-card-actions>
</v-card>`,
			},
		},
	},
}
