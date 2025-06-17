import type { Meta, StoryObj } from '@storybook/vue3'
import SyServerTable from './SyServerTable.vue'
import { ref } from 'vue'
import type { VDataTable } from 'vuetify/components'

enum StateEnum {
	IDLE = 'idle',
	PENDING = 'pending',
	RESOLVED = 'resolved',
	REJECTED = 'rejected',
}

interface DataOptions {
	sortBy?: Array<{ key: string, order: string }>
	page?: number
	itemsPerPage?: number
	groupBy?: Array<string>
	filters?: Array<{ key: string, value: unknown, type: string }>
}

const meta = {
	title: 'Composants/Tableaux/SyServerTable/Rules',
	component: SyServerTable,
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	parameters: {
		layout: 'fullscreen',
		controls: { hideNoControlsWarning: true },
	},
} satisfies Meta<typeof SyServerTable & typeof VDataTable>

export default meta

type Story = StoryObj<typeof meta>

export const TextFilterRules: Story = {
	args: {
		serverItemsLength: 9,
		suffix: 'text-filter-rules',
		showFilters: true,
	},
	parameters: {
		docs: {
			description: {
				story: 'Documentation des règles de filtrage textuel pour le composant SyServerTable.',
			},
		},
	},
	render: () => ({
		components: { SyServerTable },
		setup() {
			const headers = ref([
				{ title: 'Exemple', key: 'example', filterable: true },
				{ title: 'Description', key: 'description', filterable: false },
			])

			const demoItems = [
				{ example: 'Paris', description: 'Recherche simple (insensible à la casse) - trouve "Paris", "paris", etc.' },
				{ example: 'p*', description: 'Tous les mots commençant par "p" - trouve "Paris", "pomme", "Portugal", etc.' },
				{ example: '*is', description: 'Tous les mots finissant par "is" - trouve "Paris", "tennis", etc.' },
				{ example: 'p?r?s', description: 'Remplace chaque ? par un caractère - trouve "Paris", "parus", etc.' },
				{ example: '"Paris"', description: 'Recherche sensible à la casse - trouve "Paris" mais pas "paris"' },
				{ example: '=????', description: 'Tous les mots de 4 lettres exactement - trouve "Lyon", "Nice", etc.' },
				{ example: '<>?*', description: 'Toutes les valeurs vides ou nulles - trouve les cellules vides' },
				{ example: '>m', description: 'Tous les mots classés après "m" - trouve "Nice", "Paris", "Rome", etc.' },
				{ example: '*a*i*', description: 'Combinaison de wildcards - trouve "Paris", "Madrid", etc.' },
			]

			const items = ref([])
			const totalItems = ref(0)
			const state = ref(StateEnum.IDLE)
			const options = ref({
				itemsPerPage: 10,
				page: 1,
			})

			const wait = async (ms: number) => {
				return new Promise(resolve => setTimeout(resolve, ms))
			}

			const fetchData = async (newOptions?: DataOptions): Promise<void> => {
				state.value = StateEnum.PENDING
				await wait(1000)

				// Filtrer les éléments selon les filtres
				let filteredItems = [...demoItems]
				if (newOptions?.filters && newOptions.filters.length > 0) {
					newOptions.filters.forEach((filter) => {
						if (filter.value !== null && filter.value !== undefined) {
							const filterValue = String(filter.value).toLowerCase()
							filteredItems = filteredItems.filter((item) => {
								const itemValue = String(item[filter.key]).toLowerCase()
								return itemValue.includes(filterValue)
							})
						}
					})
				}

				totalItems.value = filteredItems.length
				items.value = filteredItems
				state.value = StateEnum.RESOLVED
			}

			// Charger les données initiales
			fetchData()

			return {
				headers,
				items,
				options,
				state,
				StateEnum,
				fetchData,
				serverItemsLength: totalItems,
			}
		},
		template: `
      <div>
        <h2>Règles de filtrage textuel</h2>
        <p class="mb-4">Le filtre textuel s'applique à une colonne de texte. Pour éviter qu'il ne soit lancé à chaque caractère saisi, il n'est déclenché qu'après un laps de temps de 300ms (par défaut) sans saisie.</p>
        
        <h3 class="mb-2">Caractères spéciaux</h3>
        <p class="mb-4">Le filtre textuel prend en charge les caractères spéciaux suivants :</p>
        
        <div class="mb-4">
          <table class="mb-4" style="width: auto; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Caractère</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Description</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Exemple</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;"><code>*</code></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Remplace n'importe quelle séquence de caractères (y compris aucun)</td>
                <td style="border: 1px solid #ddd; padding: 8px;"><code>p*s</code> (trouve "paris", "pains", "pas", etc.)</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;"><code>?</code></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Remplace exactement un caractère</td>
                <td style="border: 1px solid #ddd; padding: 8px;"><code>p?ris</code> (trouve "paris", "pâris", etc.)</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;"><code>"..."</code></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Recherche sensible à la casse</td>
                <td style="border: 1px solid #ddd; padding: 8px;"><code>"Paris"</code> (trouve "Paris" mais pas "paris")</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;"><code>=</code></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Recherche de longueur exacte</td>
                <td style="border: 1px solid #ddd; padding: 8px;"><code>=????</code> (trouve tous les mots de 4 lettres)</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;"><code>&lt;&gt;</code></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Recherche de valeurs vides ou nulles</td>
                <td style="border: 1px solid #ddd; padding: 8px;"><code>&lt;&gt;?*</code> (trouve les cellules vides)</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;"><code>&gt;</code></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Supérieur à (ordre alphabétique)</td>
                <td style="border: 1px solid #ddd; padding: 8px;"><code>&gt;m</code> (trouve les mots après "m" dans l'alphabet)</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;"><code>&lt;</code></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Inférieur à (ordre alphabétique)</td>
                <td style="border: 1px solid #ddd; padding: 8px;"><code>&lt;m</code> (trouve les mots avant "m" dans l'alphabet)</td>
              </tr>
            </tbody>
          </table>
          <p>Sans caractère spécial, le filtre effectue une recherche insensible à la casse qui trouve toutes les occurrences contenant la chaîne de recherche.</p>
        </div>
        
        <h3 class="mb-2">Documentation des règles</h3>
        <SyServerTable
          v-model:options="options"
          :headers="headers"
          :items="items"
          :server-items-length="serverItemsLength"
          :loading="state === StateEnum.PENDING"
          suffix="text-filter-rules-doc"
          show-filters
          @update:options="fetchData"
        />
      </div>
    `,
	}),
}

export const NumberFilterRules: Story = {
	args: {
		serverItemsLength: 8,
		suffix: 'number-filter-rules',
		showFilters: true,
	},
	parameters: {
		docs: {
			description: {
				story: 'Documentation des règles de filtrage numérique pour le composant SyServerTable.',
			},
		},
	},
	render: () => ({
		components: { SyServerTable },
		setup() {
			const headers = ref([
				{ title: 'Exemple', key: 'example', filterable: true, filterType: 'number' },
				{ title: 'Description', key: 'description', filterable: false },
			])

			const demoItems = [
				{ example: 42, description: 'Recherche exacte (42)' },
				{ example: 10, description: 'Recherche exacte (10)' },
				{ example: 25, description: 'Recherche exacte (25)' },
				{ example: 100, description: 'Recherche exacte (100)' },
				{ example: 75, description: 'Recherche exacte (75)' },
				{ example: 50, description: 'Recherche exacte (50)' },
				{ example: 30, description: 'Recherche exacte (30)' },
				{ example: 90, description: 'Recherche exacte (90)' },
			]

			const items = ref([])
			const totalItems = ref(0)
			const state = ref(StateEnum.IDLE)
			const options = ref({
				itemsPerPage: 10,
				page: 1,
			})

			const wait = async (ms: number) => {
				return new Promise(resolve => setTimeout(resolve, ms))
			}

			const fetchData = async (newOptions?: DataOptions): Promise<void> => {
				state.value = StateEnum.PENDING
				await wait(1000)

				// Filtrer les éléments selon les filtres
				let filteredItems = [...demoItems]
				if (newOptions?.filters && newOptions.filters.length > 0) {
					newOptions.filters.forEach((filter) => {
						if (filter.value !== null && filter.value !== undefined) {
							const filterValue = String(filter.value).toLowerCase()
							filteredItems = filteredItems.filter((item) => {
								const itemValue = String(item[filter.key])
								return itemValue.includes(filterValue)
							})
						}
					})
				}

				totalItems.value = filteredItems.length
				items.value = filteredItems
				state.value = StateEnum.RESOLVED
			}

			// Charger les données initiales
			fetchData()

			return {
				headers,
				items,
				options,
				state,
				StateEnum,
				fetchData,
				serverItemsLength: totalItems,
			}
		},
		template: `
      <div>
        <h2>Règles de filtrage numérique</h2>
        <p class="mb-4">Le filtre numérique s'applique à une colonne de nombres. Pour éviter qu'il ne soit lancé à chaque caractère saisi, il n'est déclenché qu'après un laps de temps de 300ms (par défaut) sans saisie.</p>
        
        <h3 class="mb-2">Opérateurs supportés</h3>
        <p class="mb-4">Le filtre numérique prend en charge les opérateurs suivants lorsqu'ils sont placés au début de la valeur :</p>
        
        <div class="mb-4">
          <table class="mb-4" style="width: auto; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Opérateur</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Description</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Exemple</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;"><code>=</code></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Égal à</td>
                <td style="border: 1px solid #ddd; padding: 8px;"><code>=42</code> (égal à 42)</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;"><code>&lt;&gt;</code></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Différent de</td>
                <td style="border: 1px solid #ddd; padding: 8px;"><code>&lt;&gt;42</code> (différent de 42)</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;"><code>&lt;</code></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Inférieur à</td>
                <td style="border: 1px solid #ddd; padding: 8px;"><code>&lt;42</code> (inférieur à 42)</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;"><code>&lt;=</code></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Inférieur ou égal à</td>
                <td style="border: 1px solid #ddd; padding: 8px;"><code>&lt;=42</code> (inférieur ou égal à 42)</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;"><code>&gt;</code></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Supérieur à</td>
                <td style="border: 1px solid #ddd; padding: 8px;"><code>&gt;42</code> (supérieur à 42)</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;"><code>&gt;=</code></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Supérieur ou égal à</td>
                <td style="border: 1px solid #ddd; padding: 8px;"><code>&gt;=42</code> (supérieur ou égal à 42)</td>
              </tr>
            </tbody>
          </table>
          <p>Sans opérateur, le filtre effectue une recherche d'égalité exacte.</p>
        </div>
        
        <h3 class="mb-2">Documentation des règles</h3>
        <SyServerTable
          v-model:options="options"
          :headers="headers"
          :items="items"
          :server-items-length="serverItemsLength"
          :loading="state === StateEnum.PENDING"
          suffix="number-filter-rules-doc"
          show-filters
          @update:options="fetchData"
        />
      </div>
    `,
	}),
}
