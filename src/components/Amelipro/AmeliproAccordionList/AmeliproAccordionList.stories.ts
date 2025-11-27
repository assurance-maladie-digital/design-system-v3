import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproAccordionList from './AmeliproAccordionList.vue'
import type { IDataListItem } from '../types'
import { computed, ref } from 'vue'
import { fn } from '@storybook/test'

const meta = {
	argTypes: {
		'`accordionContent-${accordion.id}`': { description: 'Slot individuel pour le contenu des accordéons' },
		'`headingContent-${accordion.id}`': { description: 'Slot individuel pour la partie droite du header des accordéons' },
		'accordionContent': { description: 'Slot générique permettant de donner le même aspect à tout le contenu des accordéons' },
		'change:pagination-select': {
			description: 'Événement émis sur le change du select de nombre de résultat par page',
			type: 'void',
		},
		'change:sort-select': {
			description: 'Événement émis sur le change du select de tri de la liste. Retourne la valeur de l’option sélectionnée',
			type: 'string | number',
		},
		'click': {
			description: 'Événement émis au click sur la pagination',
			type: 'void',
		},
		'counterLabel': { description: 'Label du compteur de résultats en haut de la liste de résultats' },
		'defaultItemOpened': { description: 'Index du bloc dépliant ouvert par défaut' },
		'groupBorderColor': { description: 'Couleur des bordures des blocs dépliants' },
		'groupBordered': { description: 'Défini des bordure sur les blocs dépliants' },
		'groupColor': { description: 'Couleur de fond des blocs dépliants' },
		'headingContent': { description: 'Slot générique permettant de donner le même aspect à toutes les parties droite du header des accordéons' },
		'hiddenLabels': { description: 'Masque les labels des champs select' },
		'hideSeparator': { description: 'Masque le séparateur entre le titre et le contenu des panneaux dépliants' },
		'items': {
			description: 'Tableau comprenant la liste des résultats',
			table: {
				type: {
					detail: `Array<{
	accordionTitle: string,
	id: number,
	[key: string]: string
}>`,
					summary: 'IDataListItem[]',
				},
			},
		},
		'itemsToDisplayDesktop': { description: 'Nombre d’éléments affichés par page en desktop par défaut' },
		'itemsToDisplayMobile': { description: 'Nombre d’éléments affichés par page en mobile par défaut' },
		'noResultListInfos': { description: 'Masques les informations et les filtres au-dessus de la liste de résultats' },
		'paginationSelectLabel': { description: 'Label du select de pagination' },
		'paginationSelectPlaceholder': { description: 'Placeholder du select de pagination' },
		'sortSelectDefaultValue': {
			description: 'valeur par défaut sélectionnée dans le select dédié aux tris',
			control: 'text',
		},
		'sortSelectItems': { description: 'Items du select dédié aux tris' },
		'sortSelectLabel': { description: 'Label du select de tri' },
		'sortSelectPlaceholder': { description: 'Placeholder du select de tri' },
		'title': { description: 'Titre de la liste' },
		'titleLevel': { description: 'Niveau de titre des items de la liste' },
		'titleUppercase': { description: 'Défini si les titres des accordéons sont affichés en lettres capitales' },
		'uniqueId': { description: 'Identifiant unique de la liste' },

	},
	component: AmeliproAccordionList,
	title: 'Composants/Amelipro/Listes de résultats/AmeliproAccordionList',
} as Meta<typeof AmeliproAccordionList>

export default meta

type Story = StoryObj<typeof AmeliproAccordionList>

const items: IDataListItem[] = [
	{
		accordionTitle: 'Titre 1',
		email: 'jean.bernard@gmail.com',
		firstname: 'Jean',
		id: 0,
		name: 'Bernard',
	},
	{
		accordionTitle: 'Titre 2',
		email: 'simon.pierre@gmail.com',
		firstname: 'Simon',
		id: 1,
		name: 'Pierre',
	},
	{
		accordionTitle: 'Titre 3',
		email: 'michel.souris@gmail.com',
		firstname: 'Michel',
		id: 2,
		name: 'Souris',
	},
	{
		accordionTitle: 'Titre 4',
		email: 'amandine.jabot@gmail.com',
		firstname: 'Amandine',
		id: 3,
		name: 'Jabot',
	},
	{
		accordionTitle: 'Titre 5',
		email: 'jean.bernard@gmail.com',
		firstname: 'Jean',
		id: 4,
		name: 'Bernard',
	},
	{
		accordionTitle: 'Titre 6',
		email: 'simon.pierre@gmail.com',
		firstname: 'Simon',
		id: 5,
		name: 'Pierre',
	},
	{
		accordionTitle: 'Titre 7',
		email: 'michel.souris@gmail.com',
		firstname: 'Michel',
		id: 6,
		name: 'Souris',
	},
	{
		accordionTitle: 'Titre 8',
		email: 'amandine.jabot@gmail.com',
		firstname: 'Amandine',
		id: 7,
		name: 'Jabot',
	},
	{
		accordionTitle: 'Titre 9',
		email: 'jean.bernard@gmail.com',
		firstname: 'Jean',
		id: 8,
		name: 'Bernard',
	},
	{
		accordionTitle: 'Titre 10',
		email: 'simon.pierre@gmail.com',
		firstname: 'Simon',
		id: 9,
		name: 'Pierre',
	},
	{
		accordionTitle: 'Titre 11',
		email: 'michel.souris@gmail.com',
		firstname: 'Michel',
		id: 10,
		name: 'Souris',
	},
	{
		accordionTitle: 'Titre 12',
		email: 'amandine.jabot@gmail.com',
		firstname: 'Amandine',
		id: 11,
		name: 'Jabot',
	},
]

export const Default: Story = {
	name: 'Par défaut',
	args: {
		items,
		'title': 'Exemple de liste de résultats',
		'uniqueId': 'amelipro-accordion-list-unique-id',
		'onOpen-close': fn(),
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproAccordionList
		:items="items"
		title="Exemple de liste de résultats"
		unique-id="amelipro-accordion-list-unique-id"
		v-bind="args"
	>
		<template #headingContent="item">
			<p class="mb-0">
				{{ item.firstname }} {{ item.name }}
			</p>
		</template>

		<template #accordionContent="item">
			<p class="mb-0">
				{{ item.email }}
			</p>
		</template>
	</AmeliproAccordionList>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproAccordionList } from '@cnamts/synapse'

	const items = [
		{
			accordionTitle: 'Titre 1',
			email: 'jean.bernard@gmail.com',
			firstname: 'Jean',
			id: 0,
			name: 'Bernard',
		},
		{
			accordionTitle: 'Titre 2',
			email: 'simon.pierre@gmail.com',
			firstname: 'Simon',
			id: 1,
			name: 'Pierre',
		},
		{
			accordionTitle: 'Titre 3',
			email: 'michel.souris@gmail.com',
			firstname: 'Michel',
			id: 2,
			name: 'Souris',
		},
		{
			accordionTitle: 'Titre 4',
			email: 'amandine.jabot@gmail.com',
			firstname: 'Amandine',
			id: 3,
			name: 'Jabot',
		},
		{
			accordionTitle: 'Titre 5',
			email: 'jean.bernard@gmail.com',
			firstname: 'Jean',
			id: 4,
			name: 'Bernard',
		},
		{
			accordionTitle: 'Titre 6',
			email: 'simon.pierre@gmail.com',
			firstname: 'Simon',
			id: 5,
			name: 'Pierre',
		},
		{
			accordionTitle: 'Titre 7',
			email: 'michel.souris@gmail.com',
			firstname: 'Michel',
			id: 6,
			name: 'Souris',
		},
		{
			accordionTitle: 'Titre 8',
			email: 'amandine.jabot@gmail.com',
			firstname: 'Amandine',
			id: 7,
			name: 'Jabot',
		},
		{
			accordionTitle: 'Titre 9',
			email: 'jean.bernard@gmail.com',
			firstname: 'Jean',
			id: 8,
			name: 'Bernard',
		},
		{
			accordionTitle: 'Titre 10',
			email: 'simon.pierre@gmail.com',
			firstname: 'Simon',
			id: 9,
			name: 'Pierre',
		},
		{
			accordionTitle: 'Titre 11',
			email: 'michel.souris@gmail.com',
			firstname: 'Michel',
			id: 10,
			name: 'Souris',
		},
		{
			accordionTitle: 'Titre 12',
			email: 'amandine.jabot@gmail.com',
			firstname: 'Amandine',
			id: 11,
			name: 'Jabot',
		},
	]
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAccordionList },
		setup() {
			return { args }
		},
		template: `
	<AmeliproAccordionList
		v-bind="args"
		@open-close="args['onOpen-close']"
	>
		<template #headingContent="item">
			<p class="mb-0">
				{{ item.firstname }} {{ item.name }}
			</p>
		</template>

		<template #accordionContent="item">
			<p class="mb-0">
				{{ item.email }}
			</p>
		</template>
	</AmeliproAccordionList>`,
	}),
}

// --- Liste simple ---
export const SimpleList: Story = {
	name: 'Liste simple',
	args: {
		items: [
			{ id: 1, accordionTitle: 'Premier élément' },
			{ id: 2, accordionTitle: 'Deuxième élément' },
			{ id: 3, accordionTitle: 'Troisième élément' },
		],
		uniqueId: 'amelipro-accordion-list-simple',
		title: 'Liste simple',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Affichage d’une liste d’accordéons simples.</p>
  <AmeliproAccordionList
    :items="items"
    unique-id="amelipro-accordion-list-simple"
    title="Liste simple"
  >
    <template #accordionContent="{ id }">
      Contenu de l’accordéon {{ id }}
    </template>
  </AmeliproAccordionList>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { AmeliproAccordionList } from '@cnamts/synapse'
  const items = [
    { id: 1, accordionTitle: 'Premier élément' },
    { id: 2, accordionTitle: 'Deuxième élément' },
    { id: 3, accordionTitle: 'Troisième élément' },
  ]
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAccordionList },
		setup() { return { args } },
		template: `
<p class="mb-2">Affichage d’une liste d’accordéons simples.</p>
<AmeliproAccordionList v-bind="args">
  <template #accordionContent="{ id }">
    Contenu de l’accordéon {{ id }}
  </template>
</AmeliproAccordionList>
`,
	}),
}

// --- Premier panneau ouvert par défaut ---
export const FirstOpen: Story = {
	name: 'Premier ouvert',
	args: {
		items: [
			{ id: 1, accordionTitle: 'Premier élément' },
			{ id: 2, accordionTitle: 'Deuxième élément' },
			{ id: 3, accordionTitle: 'Troisième élément' },
		],
		uniqueId: 'amelipro-accordion-list-first-open',
		title: 'Premier ouvert',
		defaultItemOpened: 0,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le premier panneau est ouvert par défaut grâce à la prop <code>defaultItemOpened</code>.</p>
  <AmeliproAccordionList
    :items="items"
    unique-id="amelipro-accordion-list-first-open"
    title="Premier ouvert"
    :default-item-opened="0"
  >
    <template #accordionContent="{ id }">
      Contenu de l’accordéon {{ id }}
    </template>
  </AmeliproAccordionList>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { AmeliproAccordionList } from '@cnamts/synapse'
  const items = [
    { id: 1, accordionTitle: 'Premier élément' },
    { id: 2, accordionTitle: 'Deuxième élément' },
    { id: 3, accordionTitle: 'Troisième élément' },
  ]
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAccordionList },
		setup() { return { args } },
		template: `
<p class="mb-2">Le premier panneau est ouvert par défaut grâce à la prop <code>defaultItemOpened</code>.</p>
<AmeliproAccordionList v-bind="args">
  <template #accordionContent="{ id }">
    Contenu de l’accordéon {{ id }}
  </template>
</AmeliproAccordionList>
`,
	}),
}

// --- Pagination et tri ---
export const PaginationAndSort: Story = {
	name: 'Pagination et tri',
	args: {
		items: Array.from({ length: 15 }, (_, i) => ({
			id: i + 1,
			accordionTitle: `Élément ${i + 1}`,
		})),
		uniqueId: 'amelipro-accordion-list-pagination',
		title: 'Avec pagination et tri',
		itemsToDisplayDesktop: 5,
		itemsToDisplayMobile: 2,
		sortSelectDefaultValue: 'desc',
		sortSelectItems: [
			{ title: 'Ordre croissant', value: 'asc' },
			{ title: 'Ordre décroissant', value: 'desc' },
		],
		sortSelectLabel: 'Trier par :',
		sortSelectPlaceholder: 'Choisir un ordre',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Pagination et tri sont activés grâce aux props <code>itemsToDisplayDesktop</code>, <code>itemsToDisplayMobile</code> et <code>sortSelectItems</code>. Le tri est effectif grâce à la gestion de l’événement <code>change:sort-select</code>.</p>
  <AmeliproAccordionList
    :items="sortedItems"
    unique-id="amelipro-accordion-list-pagination"
    title="Avec pagination et tri"
    :items-to-display-desktop="5"
    :items-to-display-mobile="2"
	sort-select-default-value="desc"
    :sort-select-items="[
      { title: 'Ordre croissant', value: 'asc' },
      { title: 'Ordre décroissant', value: 'desc' }
    ]"
    sort-select-label="Trier par :"
    sort-select-placeholder="Choisir un ordre"
    @change:sort-select="onSortChange"
  >
    <template #accordionContent="{ id }">
      Contenu de l’accordéon {{ id }}
    </template>
  </AmeliproAccordionList>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref, computed } from 'vue'
import { AmeliproAccordionList } from '@cnamts/synapse'

const items = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  accordionTitle: \`Élément \${i + 1}\`,
}))

const sortOrder = ref<'asc' | 'desc'>('asc')
const sortedItems = computed(() => {
  return [...items].sort((a, b) =>
    sortOrder.value === 'asc' ? a.id - b.id : b.id - a.id
  )
)

function onSortChange(val: 'asc' | 'desc') {
  sortOrder.value = val
}
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAccordionList },
		setup() {
			const items = Array.from({ length: 15 }, (_, i) => ({
				id: i + 1,
				accordionTitle: `Élément ${i + 1}`,
			}))
			const sortOrder = ref<'asc' | 'desc'>('asc')
			const sortedItems = computed(() =>
				[...items].sort((a, b) =>
					sortOrder.value === 'asc' ? a.id - b.id : b.id - a.id,
				),
			)
			function onSortChange(val: 'asc' | 'desc') {
				sortOrder.value = val
			}
			return { args, sortedItems, onSortChange }
		},
		template: `
<p class="mb-2">Pagination et tri sont activés grâce aux props <code>itemsToDisplayDesktop</code>, <code>itemsToDisplayMobile</code> et <code>sortSelectItems</code>. Le tri est effectif grâce à la gestion de l’événement <code>change:sort-select</code>.</p>
<AmeliproAccordionList
  v-bind="args"
  :items="sortedItems"
  @change:sort-select="onSortChange"
>
  <template #accordionContent="{ id }">
    Contenu de l’accordéon {{ id }}
  </template>
</AmeliproAccordionList>
`,
	}),
}
// --- Accordéons avec contenu personnalisé (slots headingContent et accordionContent) ---
export const CustomContent: Story = {
	name: 'Contenu personnalisé',
	args: {
		items: [
			{ id: 1, accordionTitle: 'Premier élément' },
			{ id: 2, accordionTitle: 'Deuxième élément' },
		],
		uniqueId: 'amelipro-accordion-list-custom',
		title: 'Contenu personnalisé',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Les slots <code>headingContent</code> et <code>accordionContent</code> permettent d’ajouter un contenu personnalisé pour chaque panneau.</p>
  <AmeliproAccordionList
    :items="items"
    unique-id="amelipro-accordion-list-custom"
    title="Contenu personnalisé"
  >
    <template #headingContent="{ id }">
      <span v-if="id === 1">Badge spécial</span>
    </template>
    <template #accordionContent="{ id }">
      <div v-if="id === 1">
        <strong>Contenu personnalisé pour le premier élément</strong>
      </div>
      <div v-else>
        <em>Autre contenu personnalisé</em>
      </div>
    </template>
  </AmeliproAccordionList>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { AmeliproAccordionList } from '@cnamts/synapse'
  const items = [
    { id: 1, accordionTitle: 'Premier élément' },
    { id: 2, accordionTitle: 'Deuxième élément' },
  ]
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAccordionList },
		setup() { return { args } },
		template: `
<p class="mb-2">Les slots <code>headingContent</code> et <code>accordionContent</code> permettent d’ajouter un contenu personnalisé pour chaque panneau.</p>
<AmeliproAccordionList v-bind="args">
  <template #headingContent="{ id }">
    <span v-if="id === 1">Badge spécial</span>
  </template>
  <template #accordionContent="{ id }">
    <div v-if="id === 1">
      <strong>Contenu personnalisé pour le premier élément</strong>
    </div>
    <div v-else>
      <em>Autre contenu personnalisé</em>
    </div>
  </template>
</AmeliproAccordionList>
`,
	}),
}

// --- Exemple avec titre en capitales et niveau de titre personnalisé ---
export const TitleUppercaseAndLevel: Story = {
	name: 'Titres capitales H3',
	args: {
		items: [
			{ id: 1, accordionTitle: 'Premier élément' },
			{ id: 2, accordionTitle: 'Deuxième élément' },
			{ id: 3, accordionTitle: 'Troisième élément' },
		],
		uniqueId: 'amelipro-accordion-list-uppercase',
		title: 'Titres capitales H3',
		titleUppercase: true,
		titleLevel: 3,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Les titres des accordéons sont en capitales et utilisent le niveau de titre <code>h3</code> grâce aux props <code>titleUppercase</code> et <code>titleLevel</code>.</p>
  <AmeliproAccordionList
    :items="items"
    unique-id="amelipro-accordion-list-uppercase"
    title="Titres capitales H3"
    title-uppercase
    :title-level="3"
  >
    <template #accordionContent="{ id }">
      Contenu de l’accordéon {{ id }}
    </template>
  </AmeliproAccordionList>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { AmeliproAccordionList } from '@cnamts/synapse'
  const items = [
    { id: 1, accordionTitle: 'Premier élément' },
    { id: 2, accordionTitle: 'Deuxième élément' },
    { id: 3, accordionTitle: 'Troisième élément' },
  ]
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAccordionList },
		setup() { return { args } },
		template: `
<p class="mb-2">Les titres des accordéons sont en capitales et utilisent le niveau de titre <code>h3</code> grâce aux props <code>titleUppercase</code> et <code>titleLevel</code>.</p>
<AmeliproAccordionList v-bind="args">
  <template #accordionContent="{ id }">
    Contenu de l’accordéon {{ id }}
  </template>
</AmeliproAccordionList>
`,
	}),
}

// --- Exemple avec bordure et couleur personnalisées ---
export const BorderedColored: Story = {
	name: 'Bordure et couleur',
	args: {
		items: [
			{ id: 1, accordionTitle: 'Premier élément' },
			{ id: 2, accordionTitle: 'Deuxième élément' },
			{ id: 3, accordionTitle: 'Troisième élément' },
		],
		uniqueId: 'amelipro-accordion-list-colored',
		title: 'Bordure et couleur',
		groupBordered: true,
		groupBorderColor: '#1976d2',
		groupColor: '#e3f2fd',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Les panneaux dépliants ont une bordure et une couleur de fond personnalisées grâce aux props <code>groupBordered</code>, <code>groupBorderColor</code> et <code>groupColor</code>.</p>
  <AmeliproAccordionList
    :items="items"
    unique-id="amelipro-accordion-list-colored"
    title="Bordure et couleur"
    group-bordered
    group-border-color="#1976d2"
    group-color="#e3f2fd"
  >
    <template #accordionContent="{ id }">
      Contenu de l’accordéon {{ id }}
    </template>
  </AmeliproAccordionList>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { AmeliproAccordionList } from '@cnamts/synapse'
  const items = [
    { id: 1, accordionTitle: 'Premier élément' },
    { id: 2, accordionTitle: 'Deuxième élément' },
    { id: 3, accordionTitle: 'Troisième élément' },
  ]
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAccordionList },
		setup() { return { args } },
		template: `
<p class="mb-2">Les panneaux dépliants ont une bordure et une couleur de fond personnalisées grâce aux props <code>groupBordered</code>, <code>groupBorderColor</code> et <code>groupColor</code>.</p>
<AmeliproAccordionList v-bind="args">
  <template #accordionContent="{ id }">
    Contenu de l’accordéon {{ id }}
  </template>
</AmeliproAccordionList>
`,
	}),
}

// --- Exemple avec séparateur masqué ---
export const HideSeparator: Story = {
	name: 'Sans séparateur',
	args: {
		items: [
			{ id: 1, accordionTitle: 'Premier élément' },
			{ id: 2, accordionTitle: 'Deuxième élément' },
			{ id: 3, accordionTitle: 'Troisième élément' },
		],
		uniqueId: 'amelipro-accordion-list-nosep',
		title: 'Sans séparateur',
		hideSeparator: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le séparateur entre le titre et le contenu est masqué grâce à la prop <code>hideSeparator</code>.</p>
  <AmeliproAccordionList
    :items="items"
    unique-id="amelipro-accordion-list-nosep"
    title="Sans séparateur"
    hide-separator
  >
    <template #accordionContent="{ id }">
      Contenu de l’accordéon {{ id }}
    </template>
  </AmeliproAccordionList>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { AmeliproAccordionList } from '@cnamts/synapse'
  const items = [
    { id: 1, accordionTitle: 'Premier élément' },
    { id: 2, accordionTitle: 'Deuxième élément' },
    { id: 3, accordionTitle: 'Troisième élément' },
  ]
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAccordionList },
		setup() { return { args } },
		template: `
<p class="mb-2">Le séparateur entre le titre et le contenu est masqué grâce à la prop <code>hideSeparator</code>.</p>
<AmeliproAccordionList v-bind="args">
  <template #accordionContent="{ id }">
    Contenu de l’accordéon {{ id }}
  </template>
</AmeliproAccordionList>
`,
	}),
}

export const NoResultListInfos: Story = {
	name: 'Sans infos de liste',
	args: {
		items: [
			{ id: 1, accordionTitle: 'Premier élément' },
			{ id: 2, accordionTitle: 'Deuxième élément' },
		],
		uniqueId: 'amelipro-accordion-list-no-infos',
		title: 'Sans infos de liste',
		noResultListInfos: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Les informations et filtres au-dessus de la liste sont masqués grâce à la prop <code>noResultListInfos</code>.</p>
  <AmeliproAccordionList
    :items="items"
    unique-id="amelipro-accordion-list-no-infos"
    title="Sans infos de liste"
    no-result-list-infos
  >
    <template #accordionContent="{ id }">
      Contenu de l’accordéon {{ id }}
    </template>
  </AmeliproAccordionList>
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAccordionList },
		setup() { return { args } },
		template: `
<p class="mb-2">Les informations et filtres au-dessus de la liste sont masqués grâce à la prop <code>noResultListInfos</code>.</p>
<AmeliproAccordionList v-bind="args">
  <template #accordionContent="{ id }">
    Contenu de l’accordéon {{ id }}
  </template>
</AmeliproAccordionList>
`,
	}),
}

export const HeadingContentPerAccordion: Story = {
	name: 'Header individuel',
	args: {
		items: [
			{ id: 1, accordionTitle: 'Premier élément' },
			{ id: 2, accordionTitle: 'Deuxième élément' },
		],
		uniqueId: 'amelipro-accordion-list-heading-per-item',
		title: 'Slot headingContent individuel',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le slot <code>headingContent-1</code> permet d’ajouter un contenu spécifique à la partie droite du header du premier accordéon.</p>
  <AmeliproAccordionList
    :items="items"
    unique-id="amelipro-accordion-list-heading-per-item"
    title="Slot headingContent individuel"
  >
    <template #headingContent-1>
      <span style="color: #1976d2;">Header personnalisé pour l’élément 1</span>
    </template>
    <template #accordionContent="{ id }">
      Contenu de l’accordéon {{ id }}
    </template>
  </AmeliproAccordionList>
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAccordionList },
		setup() { return { args } },
		template: `
<p class="mb-2">Le slot <code>headingContent-1</code> permet d’ajouter un contenu spécifique à la partie droite du header du premier accordéon.</p>
<AmeliproAccordionList v-bind="args">
  <template #headingContent-1>
    <span style="color: #1976d2;">Header personnalisé pour l’élément 1</span>
  </template>
  <template #accordionContent="{ id }">
    Contenu de l’accordéon {{ id }}
  </template>
</AmeliproAccordionList>
`,
	}),
}

export const AccordionContentPerAccordion: Story = {
	name: 'Contenu individuel',
	args: {
		items: [
			{ id: 1, accordionTitle: 'Premier élément' },
			{ id: 2, accordionTitle: 'Deuxième élément' },
		],
		uniqueId: 'amelipro-accordion-list-content-per-item',
		title: 'Slot accordionContent individuel',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le slot <code>accordionContent-2</code> permet d’ajouter un contenu spécifique au deuxième accordéon.</p>
  <AmeliproAccordionList
    :items="items"
    unique-id="amelipro-accordion-list-content-per-item"
    title="Slot accordionContent individuel"
  >
    <template #accordionContent-2>
      <strong>Contenu spécifique pour l’accordéon 2</strong>
    </template>
    <template #accordionContent="{ id }">
      <span v-if="id !== 2">Contenu générique pour l’accordéon {{ id }}</span>
    </template>
  </AmeliproAccordionList>
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAccordionList },
		setup() { return { args } },
		template: `
<p class="mb-2">Le slot <code>accordionContent-2</code> permet d’ajouter un contenu spécifique au deuxième accordéon.</p>
<AmeliproAccordionList v-bind="args">
  <template #accordionContent-2>
    <strong>Contenu spécifique pour l’accordéon 2</strong>
  </template>
  <template #accordionContent="{ id }">
    <span v-if="id !== 2">Contenu générique pour l’accordéon {{ id }}</span>
  </template>
</AmeliproAccordionList>
`,
	}),
}

export const HiddenLabels: Story = {
	name: 'Labels cachés',
	args: {
		items: [
			{ id: 1, accordionTitle: 'Premier élément' },
			{ id: 2, accordionTitle: 'Deuxième élément' },
		],
		uniqueId: 'amelipro-accordion-list-hidden-labels',
		title: 'Labels cachés',
		hiddenLabels: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Les labels des champs select sont masqués grâce à la prop <code>hiddenLabels</code>.</p>
  <AmeliproAccordionList
    :items="items"
    unique-id="amelipro-accordion-list-hidden-labels"
    title="Labels cachés"
    hidden-labels
  >
    <template #accordionContent="{ id }">
      Contenu de l’accordéon {{ id }}
    </template>
  </AmeliproAccordionList>
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAccordionList },
		setup() { return { args } },
		template: `
<p class="mb-2">Les labels des champs select sont masqués grâce à la prop <code>hiddenLabels</code>.</p>
<AmeliproAccordionList v-bind="args">
  <template #accordionContent="{ id }">
    Contenu de l’accordéon {{ id }}
  </template>
</AmeliproAccordionList>
`,
	}),
}
