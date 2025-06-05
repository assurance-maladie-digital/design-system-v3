import type { Meta, StoryObj } from '@storybook/vue3'
import SyTable from './SyTable.vue'
import { ref } from 'vue'
import type { VDataTable } from 'vuetify/components'

const meta = {
	title: 'Composants/Tableaux/SyTable/Rules',
	component: SyTable,
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	parameters: {
		layout: 'fullscreen',
		controls: { hideNoControlsWarning: true },
	},
} satisfies Meta<typeof SyTable & typeof VDataTable>

export default meta

type Story = StoryObj<typeof meta>

export const FilterRules: Story = {
	args: {
		suffix: 'filter-rules',
		showFilters: true,
	},
	parameters: {
		docs: {
			description: {
				story: 'Documentation des règles de filtrage textuel pour le composant SyTable.',
			},
		},
	},
	render: () => ({
		components: { SyTable },
		setup() {
			const headers = ref([
				{ title: 'Exemple', key: 'example', filterable: true },
				{ title: 'Description', key: 'description', filterable: false },
			])

			const items = ref([
				{ example: 'texte', description: 'Recherche simple (insensible à la casse)' },
				{ example: '*', description: 'Remplace n\'importe quelle chaîne de caractères' },
				{ example: '?', description: 'Remplace n\'importe quel caractère unique' },
				{ example: '"texte"', description: 'Recherche sensible à la casse et aux accents' },
				{ example: 'p*', description: 'Tous les mots commençant par "p", quelle que soit la casse' },
				{ example: '=????', description: 'Tous les mots de 4 lettres exactement' },
				{ example: '<>?*', description: 'Toutes les valeurs vides ou nulles' },
				{ example: '>zu', description: 'Tous les mots classés après "zu" alphabétiquement' },
			])

			const options = ref({
				itemsPerPage: 10,
			})

			return {
				headers,
				items,
				options,
			}
		},
		template: `
      <div>
        <h2>Règles de filtrage textuel</h2>
        <p class="mb-4">Le filtre textuel s'applique à une colonne de texte. Pour éviter qu'il ne soit lancé à chaque caractère saisi, il n'est déclenché qu'après un laps de temps de 300ms (par défaut) sans saisie.</p>
        
        <SyTable
          v-model:options="options"
          :headers="headers"
          :items="items"
          suffix="filter-rules"
          show-filters
        />
      </div>
    `,
	}),
}
