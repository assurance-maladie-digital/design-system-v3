import type { Meta, StoryObj } from '@storybook/vue3'
import SyTable from './SyTable.vue'
import { ref } from 'vue'
import type { VDataTable } from 'vuetify/components'
import dayjs from 'dayjs'

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

export const TextFilterRules: Story = {
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
				{ example: 'Paris', description: 'Recherche simple (insensible à la casse) - trouve "Paris", "paris", etc.' },
				{ example: 'p*', description: 'Tous les mots commençant par "p" - trouve "Paris", "pomme", "Portugal", etc.' },
				{ example: '*is', description: 'Tous les mots finissant par "is" - trouve "Paris", "tennis", etc.' },
				{ example: 'p?r?s', description: 'Remplace chaque ? par un caractère - trouve "Paris", "parus", etc.' },
				{ example: '"Paris"', description: 'Recherche sensible à la casse - trouve "Paris" mais pas "paris"' },
				{ example: '=????', description: 'Tous les mots de 4 lettres exactement - trouve "Lyon", "Nice", etc.' },
				{ example: '<>?*', description: 'Toutes les valeurs vides ou nulles - trouve les cellules vides' },
				{ example: '>m', description: 'Tous les mots classés après "m" - trouve "Nice", "Paris", "Rome", etc.' },
				{ example: '*a*i*', description: 'Combinaison de wildcards - trouve "Paris", "Madrid", etc.' },
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
        
        <h3 class="mb-2">Opérateurs et caractères spéciaux supportés</h3>
        <p class="mb-4">Le filtre textuel prend en charge les opérateurs et caractères spéciaux suivants :</p>
        
        <div class="mb-4">
          <table class="mb-4" style="width: auto; border-collapse: collapse;">
            <thead>
              <tr>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Opérateur/Caractère</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Description</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Exemple</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;"><code>*</code></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Remplace n'importe quelle chaîne de caractères</td>
                <td style="border: 1px solid #ddd; padding: 8px;"><code>p*</code> (tous les mots commençant par "p")</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;"><code>?</code></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Remplace n'importe quel caractère unique</td>
                <td style="border: 1px solid #ddd; padding: 8px;"><code>p?re</code> ("père", "pare", "pire", etc.)</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;"><code>"texte"</code></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Recherche sensible à la casse et aux accents</td>
                <td style="border: 1px solid #ddd; padding: 8px;"><code>"Paris"</code> (trouve "Paris" mais pas "paris")</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;"><code>=????</code></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Tous les mots de longueur exacte</td>
                <td style="border: 1px solid #ddd; padding: 8px;"><code>=????</code> (tous les mots de 4 lettres)</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;"><code>&lt;&gt;?*</code></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Toutes les valeurs vides ou nulles</td>
                <td style="border: 1px solid #ddd; padding: 8px;"><code>&lt;&gt;?*</code> (cellules vides)</td>
              </tr>
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;"><code>&gt;texte</code></td>
                <td style="border: 1px solid #ddd; padding: 8px;">Tous les mots classés après alphabétiquement</td>
                <td style="border: 1px solid #ddd; padding: 8px;"><code>&gt;m</code> (mots commençant par n à z)</td>
              </tr>
            </tbody>
          </table>
          <p>Sans opérateur spécial, le filtre effectue une recherche insensible à la casse.</p>
        </div>
        
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

export const NumberFilterRules: Story = {
	args: {
		suffix: 'number-filter-rules',
		showFilters: true,
	},
	parameters: {
		docs: {
			description: {
				story: 'Documentation des règles de filtrage numérique pour le composant SyTable.',
			},
		},
	},
	render: () => ({
		components: { SyTable },
		setup() {
			const headers = ref([
				{ title: 'Exemple', key: 'example', filterable: true, filterType: 'number' },
				{ title: 'Description', key: 'description', filterable: false },
			])

			const items = ref([
				{ example: 42, description: 'Recherche exacte (42)' },
				{ example: 10, description: 'Recherche exacte (10)' },
				{ example: 25, description: 'Recherche exacte (25)' },
				{ example: 100, description: 'Recherche exacte (100)' },
				{ example: 75, description: 'Recherche exacte (75)' },
				{ example: 50, description: 'Recherche exacte (50)' },
				{ example: 30, description: 'Recherche exacte (30)' },
				{ example: 90, description: 'Recherche exacte (90)' },
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
        
        <SyTable
          v-model:options="options"
          :headers="headers"
          :items="items"
          suffix="number-filter-rules"
          show-filters
        />
      </div>
    `,
	}),
}

export const SelectFilterRules: Story = {
	args: {
		suffix: 'select-filter-rules',
		showFilters: true,
	},
	parameters: {
		docs: {
			description: {
				story: 'Documentation des règles de filtrage par sélection pour le composant SyTable.',
			},
		},
	},
	render: () => ({
		components: { SyTable },
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

			const items = ref([
				{ category: 'Fruits', description: 'Catégorie standard avec valeur non vide' },
				{ category: 'Légumes', description: 'Catégorie standard avec valeur non vide' },
				{ category: '', description: 'Catégorie avec valeur vide, affichée comme "(vide)" dans la liste' },
				{ category: 'Fruits', description: 'Valeur dupliquée, apparaît une seule fois dans la liste' },
				{ category: 'Boissons', description: 'Catégorie standard avec valeur non vide' },
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
        <h2>Règles de filtrage par sélection</h2>
        <p class="mb-4">Les filtres de sélection permettent de choisir parmi les valeurs uniques présentes dans la colonne.</p>
        
        <div class="mb-4">
          <p>Les filtres de choix sont des listes reprenant les éléments uniques présents dans l'ensemble des colonnes non filtrés. Pour faciliter l'accessibilité de la liste, le premier élément contient la valeur « - choisir - » pour indiquer qu'aucune ligne n'est filtré. Si l'une des cellules de la colonne est vide, l'élément de liste correspondant doit afficher la valeur « (vide) ».</p>
          <p>L'action de filtrage est effectuée à la sélection d'une option de la liste de choix.</p>
        </div>
		  
        <SyTable
          v-model:options="options"
          :headers="headers"
          :items="items"
          suffix="select-filter-rules"
          show-filters
        />
      </div>
    `,
	}),
}

export const DateFilterRules: Story = {
	args: {
		suffix: 'date-filter-rules',
		showFilters: true,
	},
	parameters: {
		docs: {
			description: {
				story: 'Documentation des règles de filtrage par date pour le composant SyTable.',
			},
		},
	},
	render: () => ({
		components: { SyTable },
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

			const itemsSingleDate = ref([
				{ date: dayjs('2025-01-15').format('DD/MM/YYYY'), description: 'Date simple' },
				{ date: dayjs('2025-02-20').format('DD/MM/YYYY'), description: 'Date simple' },
				{ date: dayjs('2024-12-10').format('DD/MM/YYYY'), description: 'Date simple' },
				{ date: dayjs('2025-05-05').format('DD/MM/YYYY'), description: 'Date simple' },
			])

			const optionsSingleDate = ref({
				itemsPerPage: 10,
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

			const itemsPeriod = ref([
				{ date: dayjs('2025-01-15').format('DD/MM/YYYY'), description: `Date incluse dans la période ${periodStart} - ${periodEnd}` },
				{ date: dayjs('2025-02-20').format('DD/MM/YYYY'), description: `Date incluse dans la période ${periodStart} - ${periodEnd}` },
				{ date: dayjs('2024-12-10').format('DD/MM/YYYY'), description: `Date avant la période ${periodStart} - ${periodEnd}` },
				{ date: dayjs('2025-05-05').format('DD/MM/YYYY'), description: `Date après la période ${periodStart} - ${periodEnd}` },
				{ date: dayjs('2025-01-01').format('DD/MM/YYYY'), description: `Date limite inférieure de la période (${periodStart})` },
				{ date: dayjs('2025-03-31').format('DD/MM/YYYY'), description: `Date limite supérieure de la période (${periodEnd})` },
			])

			const optionsPeriod = ref({
				itemsPerPage: 10,
			})

			return {
				headersSingleDate,
				itemsSingleDate,
				optionsSingleDate,
				headersPeriod,
				itemsPeriod,
				optionsPeriod,
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
          <p>L'action de filtrage s'effectue quand 10 caractères sont présents dans le champ de saisie en cours.</p>
        </div>

        <h3 class="mb-3">Exemple 1: Filtrage par date seule</h3>
        <SyTable
          v-model:options="optionsSingleDate"
          :headers="headersSingleDate"
          :items="itemsSingleDate"
          suffix="date-filter-single"
          show-filters
        />

        <h3 class="mt-6 mb-3">Exemple 2: Filtrage par période</h3>
        <SyTable
          v-model:options="optionsPeriod"
          :headers="headersPeriod"
          :items="itemsPeriod"
          suffix="date-filter-period"
          show-filters
        />
      </div>
    `,
	}),
}
