import type { Meta, StoryObj } from '@storybook/vue3'
import SyServerTable from './SyServerTable.vue'
import { ref } from 'vue'
import type { VDataTable } from 'vuetify/components'
import dayjs from 'dayjs'

interface TextItem {
	example: string
	description: string
	[key: string]: string
}

interface NumberItem {
	example: number
	description: string
	[key: string]: string | number
}

interface SelectItem {
	category: string
	description: string
	[key: string]: string
}

interface DateItem {
	date: string
	description: string
	[key: string]: string
}
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
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	filters?: Array<{ key: string, value: any, type: string }>
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

			const items = ref<TextItem[]>([])
			const totalItems = ref(0)
			const state = ref(StateEnum.IDLE)
			const options = ref({
				itemsPerPage: 10,
				page: 1,
			})

			const wait = async (ms: number): Promise<void> => {
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
        
        <h3 class="mb-2">Opérateurs et caractères spéciaux supportés</h3>
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
          <p>Sans opérateur spécial, le filtre effectue une recherche insensible à la casse.</p>
        </div>
		  
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

			const items = ref<NumberItem[]>([])
			const totalItems = ref(0)
			const state = ref(StateEnum.IDLE)
			const options = ref({
				itemsPerPage: 10,
				page: 1,
			})

			const wait = async (ms: number): Promise<void> => {
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

export const SelectFilterRules: Story = {
	args: {
		serverItemsLength: 5,
		suffix: 'select-filter-rules',
		showFilters: true,
	},
	parameters: {
		docs: {
			description: {
				story: 'Documentation des règles de filtrage par sélection pour le composant SyServerTable.',
			},
		},
	},
	render: () => ({
		components: { SyServerTable },
		setup() {
			const headers = ref([
				{
					title: 'Catégorie',
					key: 'category',
					filterable: true,
					filterType: 'select',
					filterOptions: [
						{ text: 'Fruits', value: 'Fruits' },
						{ text: 'Légumes', value: 'Légumes' },
						{ text: 'Boissons', value: 'Boissons' },
						{ text: '(vide)', value: '' },
					],
				},
				{ title: 'Description', key: 'description', filterable: false },
			])

			const demoItems = [
				{ category: 'Fruits', description: 'Catégorie standard avec valeur non vide' },
				{ category: 'Légumes', description: 'Catégorie standard avec valeur non vide' },
				{ category: '', description: 'Catégorie avec valeur vide, affichée comme "(vide)" dans la liste' },
				{ category: 'Fruits', description: 'Valeur dupliquée, apparaît une seule fois dans la liste' },
				{ category: 'Boissons', description: 'Catégorie standard avec valeur non vide' },
			]

			const items = ref<SelectItem[]>([])
			const totalItems = ref(0)
			const state = ref(StateEnum.IDLE)
			const options = ref({
				itemsPerPage: 10,
				page: 1,
			})

			const wait = async (ms: number): Promise<void> => {
				return new Promise(resolve => setTimeout(resolve, ms))
			}

			const fetchData = async (newOptions?: DataOptions): Promise<void> => {
				state.value = StateEnum.PENDING
				await wait(1000)

				let filteredItems = [...demoItems]
				const filters = newOptions?.filters || []

				filters.forEach((filter) => {
					if (filter.key === 'category') {
						// Si la valeur est une chaîne vide, on filtre les lignes avec des valeurs vides
						// Sinon, on filtre normalement par la valeur sélectionnée
						filteredItems = filteredItems.filter((item) => {
							// Gestion spéciale pour les valeurs vides
							if (filter.value === '') {
								return item[filter.key] === ''
							}
							// Pour les autres valeurs, filtre normal
							else if (filter.value) {
								return item[filter.key] === filter.value
							}
							// Si pas de valeur de filtre, on garde tout
							return true
						})
					}
				})

				totalItems.value = filteredItems.length
				items.value = filteredItems
				state.value = StateEnum.RESOLVED
			}

			// Chargement initial des données
			fetchData(options.value)

			return {
				headers,
				items,
				options,
				state,
				StateEnum,
				serverItemsLength: totalItems,
				fetchData,
			}
		},
		template: `
      <div>
        <h2>Règles de filtrage par sélection</h2>
        <p class="mb-4">Les filtres de sélection permettent de choisir parmi les valeurs uniques présentes dans la colonne.</p>
        
        <div class="mb-4">
          <p>Les filtres de choix sont des listes reprenant les éléments uniques présents dans l'ensemble des colonnes non filtrés. Pour faciliter l'accessibilité de la liste, le premier élément contient la valeur « - choisir - » pour indiquer qu'aucune ligne n'est filtré. Si l'une des cellules de la colonne est vide, l'élément de liste correspondant doit afficher la valeur « (vide) ».</p>
          <p>L'action de filtrage est effectuée à la sélection d'une option de la liste de choix.</p>
        </div>
		  
        <SyServerTable
          v-model:options="options"
          :headers="headers"
          :items="items"
          :server-items-length="serverItemsLength"
          :loading="state === StateEnum.PENDING"
          suffix="select-filter-rules-doc"
          show-filters
          @update:options="fetchData"
        />
      </div>
    `,
	}),
}
export const DateFilterRules = {
	args: {
		serverItemsLength: 10,
		suffix: 'date-filter-rules',
		showFilters: true,
	},
	parameters: {
		docs: {
			description: {
				story: 'Documentation des règles de filtrage par date pour le composant SyServerTable.',
			},
		},
	},
	render: () => ({
		components: { SyServerTable },
		setup() {
			// Exemple 1: Filtrage par date seule
			const headersSingleDate = ref([
				{
					title: 'Date',
					key: 'date',
					filterable: true,
					filterType: 'date',
				},
				{ title: 'Description', key: 'description', filterable: false },
			])

			const demoItemsSingleDate = [
				{ date: dayjs('2025-01-15').format('DD/MM/YYYY'), description: 'Date simple' },
				{ date: dayjs('2025-02-20').format('DD/MM/YYYY'), description: 'Date simple' },
				{ date: dayjs('2024-12-10').format('DD/MM/YYYY'), description: 'Date simple' },
				{ date: dayjs('2025-05-05').format('DD/MM/YYYY'), description: 'Date simple' },
			]

			const itemsSingleDate = ref<DateItem[]>([])
			const totalItemsSingleDate = ref(0)
			const stateSingleDate = ref(StateEnum.IDLE)
			const optionsSingleDate = ref({
				itemsPerPage: 10,
				page: 1,
			})

			// Exemple 2: Filtrage par période
			const headersPeriod = ref([
				{
					title: 'Date',
					key: 'date',
					filterable: true,
					filterType: 'period',
					dateFormat: 'DD/MM/YYYY',
				},
				{ title: 'Description', key: 'description', filterable: false },
			])

			// Définir une période du 01/01/2025 au 31/03/2025 pour l'exemple
			const periodStart = dayjs('2025-01-01').format('DD/MM/YYYY')
			const periodEnd = dayjs('2025-03-31').format('DD/MM/YYYY')

			const demoItemsPeriod = [
				{ date: dayjs('2025-01-15').format('DD/MM/YYYY'), description: `Date incluse dans la période ${periodStart} - ${periodEnd}` },
				{ date: dayjs('2025-02-20').format('DD/MM/YYYY'), description: `Date incluse dans la période ${periodStart} - ${periodEnd}` },
				{ date: dayjs('2024-12-10').format('DD/MM/YYYY'), description: `Date avant la période ${periodStart} - ${periodEnd}` },
				{ date: dayjs('2025-05-05').format('DD/MM/YYYY'), description: `Date après la période ${periodStart} - ${periodEnd}` },
				{ date: dayjs('2025-01-01').format('DD/MM/YYYY'), description: `Date limite inférieure de la période (${periodStart})` },
				{ date: dayjs('2025-03-31').format('DD/MM/YYYY'), description: `Date limite supérieure de la période (${periodEnd})` },
			]

			const itemsPeriod = ref<DateItem[]>([])
			const totalItemsPeriod = ref(0)
			const statePeriod = ref(StateEnum.IDLE)
			const optionsPeriod = ref({
				itemsPerPage: 10,
				page: 1,
			})

			const wait = async (ms: number): Promise<void> => {
				return new Promise(resolve => setTimeout(resolve, ms))
			}

			// Fonction de filtrage pour l'exemple 1 (date simple)
			const fetchDataSingleDate = async (newOptions?: DataOptions): Promise<void> => {
				stateSingleDate.value = StateEnum.PENDING
				await wait(1000)

				// Filtrer les éléments selon les filtres
				let filteredItems = [...demoItemsSingleDate]
				if (newOptions?.filters && newOptions.filters.length > 0) {
					newOptions.filters.forEach((filter) => {
						if (filter.value !== null && filter.value !== undefined && filter.value !== '') {
							const filterValue = String(filter.value).toLowerCase()
							filteredItems = filteredItems.filter((item) => {
								const itemValue = String(item[filter.key]).toLowerCase()
								return itemValue === filterValue
							})
						}
					})
				}

				totalItemsSingleDate.value = filteredItems.length
				itemsSingleDate.value = filteredItems
				stateSingleDate.value = StateEnum.RESOLVED
			}

			// Fonction de filtrage pour l'exemple 2 (période)
			const fetchDataPeriod = async (newOptions?: DataOptions): Promise<void> => {
				statePeriod.value = StateEnum.PENDING
				await wait(1000)

				// Filtrer les éléments selon les filtres
				let filteredItems = [...demoItemsPeriod]
				if (newOptions?.filters && newOptions.filters.length > 0) {
					newOptions.filters.forEach((filter) => {
						if (filter.value !== null && filter.value !== undefined) {
							// Pour le filtre de période, la valeur peut être un objet avec from et to
							if (filter.type === 'period' && typeof filter.value === 'object') {
								const { from, to } = filter.value

								filteredItems = filteredItems.filter((item) => {
									const itemDate = dayjs(item[filter.key], 'DD/MM/YYYY')

									// Si from et to sont définis, vérifier si la date est dans l'intervalle
									if (from && to) {
										return itemDate.isAfter(dayjs(from, 'DD/MM/YYYY').subtract(1, 'day'))
											&& itemDate.isBefore(dayjs(to, 'DD/MM/YYYY').add(1, 'day'))
									}
									// Si seulement from est défini, vérifier si la date est après from
									else if (from) {
										return itemDate.isAfter(dayjs(from, 'DD/MM/YYYY').subtract(1, 'day'))
									}
									// Si seulement to est défini, vérifier si la date est avant to
									else if (to) {
										return itemDate.isBefore(dayjs(to, 'DD/MM/YYYY').add(1, 'day'))
									}
									return true
								})
							}
							else {
								const filterValue = String(filter.value).toLowerCase()
								filteredItems = filteredItems.filter((item) => {
									const itemValue = String(item[filter.key]).toLowerCase()
									return itemValue === filterValue
								})
							}
						}
					})
				}

				totalItemsPeriod.value = filteredItems.length
				itemsPeriod.value = filteredItems
				statePeriod.value = StateEnum.RESOLVED
			}

			// Charger les données initiales
			fetchDataSingleDate()
			fetchDataPeriod()

			return {
				headersSingleDate,
				itemsSingleDate,
				optionsSingleDate,
				stateSingleDate,
				serverItemsLengthSingleDate: totalItemsSingleDate,
				fetchDataSingleDate,

				headersPeriod,
				itemsPeriod,
				optionsPeriod,
				statePeriod,
				serverItemsLengthPeriod: totalItemsPeriod,
				fetchDataPeriod,

				StateEnum,
			}
		},
		template: `
      <div>
        <h2>Règles de filtrage par date</h2>
        <p class="mb-4">Le filtre de date s'applique à une colonne de dates.</p>
        
        <div class="mb-4">
          <p>Le filtre de période comporte deux champs de saisies permettant de saisir une période du … au …</p>
          <ul class="mb-4 pl-4">
            <li>Le premier champ de saisie représente la date minimale recherchée (inclue). S'il n'est pas renseigné, il n'y a pas de limite minimale.</li>
            <li>Le deuxième champ de saisie représente la date maximale recherchée (inclue). S'il n'est pas renseigné, il n'y a pas de limite maximale.</li>
          </ul>
          <p>L'action de filtrage est effectuée lorsque 10 caractères sont présents dans le champ de saisie actif.</p>
        </div>

        <h3 class="mb-3">Exemple 1: Filtrage par date seule</h3>
        <SyServerTable
          v-model:options="optionsSingleDate"
          :headers="headersSingleDate"
          :items="itemsSingleDate"
          :server-items-length="serverItemsLengthSingleDate"
          :loading="stateSingleDate === StateEnum.PENDING"
          suffix="date-filter-single"
          show-filters
          @update:options="fetchDataSingleDate"
        />

        <h3 class="mt-6 mb-3">Exemple 2: Filtrage par période</h3>
        <SyServerTable
          v-model:options="optionsPeriod"
          :headers="headersPeriod"
          :items="itemsPeriod"
          :server-items-length="serverItemsLengthPeriod"
          :loading="statePeriod === StateEnum.PENDING"
          suffix="date-filter-period"
          show-filters
          @update:options="fetchDataPeriod"
        />
      </div>
    `,
	}),
}
