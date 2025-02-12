import type { Meta, StoryObj } from '@storybook/vue3'
import TableToolbar from './TableToolbar.vue'

const meta = {
	title: 'Composants/Tableaux/TableToolbar',
	component: TableToolbar,
	argTypes: {
		'nbTotal': {
			description: 'Le nombre total de résultats',
			type: 'number',
			control: {
				type: 'number',
			},
			table: {
				category: 'props',
			},
		},
		'nbFiltered': {
			description: 'Le nombre de résultats filtrés.',
			type: 'number',
			control: {
				type: 'number',
			},
		},
		'search': {
			description: 'La valeur du champ de recherche',
			type: 'string',
			control: {
				type: 'text',
			},
		},
		'searchLabel': {
			description: 'Le label du champ de recherche',
			type: 'string',
			control: {
				type: 'text',
			},
			defaultValue: 'Rechercher',
		},
		'showAddButton': {
			description: 'Affiche le bouton d\'ajout',
			type: 'boolean',
			control: {
				type: 'boolean',
			},
		},
		'addButtonLabel': {
			description: 'Le label du bouton d\'ajout',
			type: 'string',
			control: {
				type: 'text',
			},
			defaultValue: 'Ajouter',
		},
		'loading': {
			description: 'Désactive les éléments interactifs',
			type: 'boolean',
			control: {
				type: 'boolean',
			},
			defaultValue: false,
		},
		'locales': {
			description: 'Traductions',
			control: {
				type: 'object',
			},
			table: {
				type: {
					summary: 'object',
				},
				defaultValue: {
					summary: 'Locales',
					detail: `{
	rowText: (lignes: string, plural: boolean): string =>
\`\${lignes} ligne\${plural ? 's' : ''}\`,
	search: 'Rechercher',
	addBtnLabel: 'Ajouter',
}`,
				},
			},
		},
		'vuetifyOptions': {
			control: 'object',
			description: 'Personnalisation des composants Vuetify internes',
			table: {
				category: 'props',
				defaultValue: {
					summary: 'object',
					detail: `
{
	toolbar: {
		flat: true,
		color: '#FFFFFF',
		height: 'auto',
		minHeight: '56px',
		class: 'd-flex',
	},
	addBtn: {
		variant: 'outlined',
		color: 'primary',
		class: 'my-1 px-2 px-md-4',
		minWidth: '44px',
	},
	addIconLabel: {
		class: 'mr-1',
	},
	textField: {
		variant: 'underlined',
		clearable: true,
		singleLine: true,
		hideDetails: true,
	},
}`,
				},
			},
		},
		'search-left': {
			control: 'text',
			description: 'Slot pour le contenu à gauche du champ de recherche',
		},
		'search-right': {
			control: 'text',
			description: 'Slot pour le contenu à droite du champ de recherche',
		},
		'onAdd': {
			description: 'Événement émis lors du clic sur le bouton d\'ajout',
			table: {
				category: 'events',
			},
		},
		'onUpdate:search': {
			description: 'Événement émis lors de la modification du champ de recherche',
			table: {
				category: 'events',
			},
		},
		'add': {
			description: 'Slot pour le contenu du bouton d\'ajout',
		},
	},
	parameters: {
		controls: {
			exclude: ['add', 'update:search'],
		},
	},
} satisfies Meta<typeof TableToolbar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		nbFiltered: 5,
		nbTotal: 10,
	},
}
