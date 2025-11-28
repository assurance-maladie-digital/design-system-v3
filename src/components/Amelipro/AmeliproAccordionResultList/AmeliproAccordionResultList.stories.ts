import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproAccordionResultList from './AmeliproAccordionResultList.vue'
import type { IDataListItem } from '../types'
import { computed, ref } from 'vue'
import { fn } from '@storybook/test'

const meta = {
	argTypes: {
		'`accordionContent-${accordion.id}`': { description: 'Slot individuel pour le contenu des accordéons' },
		'`headingContent-${accordion.id}`': { description: 'Slot individuel pour la partie droite du header des accordéons' },
		'accordionContent': { description: 'Slot générique permettant de donner le même aspect à tout le contenu des accordéons' },
		'change:pagination-select': {
			table: { category: 'events' },
			description: 'Événement émis sur le change du select de nombre de résultat par page',
		},
		'change:sort-select': {
			table: { category: 'events' },
			description: 'Événement émis sur le change du select de tri de la liste',
		},
		'click': {
			table: { category: 'events' },
			description: 'Événement émis au click sur la pagination',
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
		'title': { description: 'Label de la liste' },
		'uniqueId': { description: 'Identifiant unique de la liste' },

	},
	component: AmeliproAccordionResultList,
	title: 'Composants/Amelipro/Listes de résultats/AmeliproAccordionResultList',
} as Meta<typeof AmeliproAccordionResultList>

export default meta

type Story = StoryObj<typeof AmeliproAccordionResultList>

const items: IDataListItem[] = [
	{
		email: 'jean.bernard@gmail.com',
		firstname: 'Jean',
		id: 0,
		name: 'Bernard',
	},
	{
		email: 'simon.pierre@gmail.com',
		firstname: 'Simon',
		id: 1,
		name: 'Pierre',
	},
	{
		email: 'michel.souris@gmail.com',
		firstname: 'Michel',
		id: 2,
		name: 'Souris',
	},
	{
		email: 'amandine.jabot@gmail.com',
		firstname: 'Amandine',
		id: 3,
		name: 'Jabot',
	},
	{
		email: 'jean.bernard@gmail.com',
		firstname: 'Jean',
		id: 4,
		name: 'Bernard',
	},
	{
		email: 'simon.pierre@gmail.com',
		firstname: 'Simon',
		id: 5,
		name: 'Pierre',
	},
	{
		email: 'michel.souris@gmail.com',
		firstname: 'Michel',
		id: 6,
		name: 'Souris',
	},
	{
		email: 'amandine.jabot@gmail.com',
		firstname: 'Amandine',
		id: 7,
		name: 'Jabot',
	},
	{
		email: 'jean.bernard@gmail.com',
		firstname: 'Jean',
		id: 8,
		name: 'Bernard',
	},
	{
		email: 'simon.pierre@gmail.com',
		firstname: 'Simon',
		id: 9,
		name: 'Pierre',
	},
	{
		email: 'michel.souris@gmail.com',
		firstname: 'Michel',
		id: 10,
		name: 'Souris',
	},
	{
		email: 'amandine.jabot@gmail.com',
		firstname: 'Amandine',
		id: 11,
		name: 'Jabot',
	},
]

export const Default: Story = {
	args: {
		items,
		'title': 'Exemple de liste de résultats',
		'uniqueId': 'amelipro-accordion-result-list-unique-id',
		'onOpen-close': fn(),
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproAccordionResultList
		:items="items"
		title="Exemple de liste de résultats"
		unique-id="amelipro-accordion-result-list-unique-id"
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
	</AmeliproAccordionResultList>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproAccordionResultList } from '@cnamts/synapse'

	const items = [
		{
			email: 'jean.bernard@gmail.com',
			firstname: 'Jean',
			id: 0,
			name: 'Bernard',
		},
		{
			email: 'simon.pierre@gmail.com',
			firstname: 'Simon',
			id: 1,
			name: 'Pierre',
		},
		{
			email: 'michel.souris@gmail.com',
			firstname: 'Michel',
			id: 2,
			name: 'Souris',
		},
		{
			email: 'amandine.jabot@gmail.com',
			firstname: 'Amandine',
			id: 3,
			name: 'Jabot',
		},
		{
			email: 'jean.bernard@gmail.com',
			firstname: 'Jean',
			id: 4,
			name: 'Bernard',
		},
		{
			email: 'simon.pierre@gmail.com',
			firstname: 'Simon',
			id: 5,
			name: 'Pierre',
		},
		{
			email: 'michel.souris@gmail.com',
			firstname: 'Michel',
			id: 6,
			name: 'Souris',
		},
		{
			email: 'amandine.jabot@gmail.com',
			firstname: 'Amandine',
			id: 7,
			name: 'Jabot',
		},
		{
			email: 'jean.bernard@gmail.com',
			firstname: 'Jean',
			id: 8,
			name: 'Bernard',
		},
		{
			email: 'simon.pierre@gmail.com',
			firstname: 'Simon',
			id: 9,
			name: 'Pierre',
		},
		{
			email: 'michel.souris@gmail.com',
			firstname: 'Michel',
			id: 10,
			name: 'Souris',
		},
		{
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
		components: { AmeliproAccordionResultList },
		setup() {
			return { args }
		},
		template: `
	<AmeliproAccordionResultList
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
	</AmeliproAccordionResultList>`,
	}),
}

// --- Liste simple ---
export const ListeSimple: Story = {
	name: 'Liste simple',
	args: {
		items: [
			{ id: 1, accordionTitle: 'Premier résultat' },
			{ id: 2, accordionTitle: 'Deuxième résultat' },
			{ id: 3, accordionTitle: 'Troisième résultat' },
		],
		uniqueId: 'amelipro-accordion-result-list-simple',
		title: 'Liste simple',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Affichage d’une liste de résultats dépliants simples.</p>
  <AmeliproAccordionResultList
    :items="items"
    unique-id="amelipro-accordion-result-list-simple"
    title="Liste simple"
  >
    <template #headingContent="{ accordionTitle }">
      Header du {{ accordionTitle }}
    </template>
    <template #accordionContent="{ id }">
      Contenu du résultat {{ id }}
    </template>
  </AmeliproAccordionResultList>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { AmeliproAccordionResultList } from '@cnamts/synapse'
  const items = [
    { id: 1, accordionTitle: 'Premier résultat' },
    { id: 2, accordionTitle: 'Deuxième résultat' },
    { id: 3, accordionTitle: 'Troisième résultat' },
  ]
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAccordionResultList },
		setup() { return { args } },
		template: `
<p class="mb-2">Affichage d’une liste de résultats dépliants simples.</p>
<AmeliproAccordionResultList v-bind="args">
  <template #headingContent="{ accordionTitle }">
    Header du {{ accordionTitle }}
  </template>
  <template #accordionContent="{ id }">
    Contenu du résultat {{ id }}
  </template>
</AmeliproAccordionResultList>
`,
	}),
}

// --- Premier panneau ouvert par défaut ---
export const PremierOuvert: Story = {
	name: 'Premier ouvert',
	args: {
		items: [
			{ id: 1, accordionTitle: 'Premier résultat' },
			{ id: 2, accordionTitle: 'Deuxième résultat' },
			{ id: 3, accordionTitle: 'Troisième résultat' },
		],
		uniqueId: 'amelipro-accordion-result-list-first-open',
		title: 'Premier ouvert',
		defaultItemOpened: 0,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le premier panneau est ouvert par défaut grâce à la prop <code>defaultItemOpened</code>.</p>
  <AmeliproAccordionResultList
    :items="items"
    unique-id="amelipro-accordion-result-list-first-open"
    title="Premier ouvert"
    :default-item-opened="0"
  >
    <template #headingContent="{ accordionTitle }">
      Header du {{ accordionTitle }}
    </template>
    <template #accordionContent="{ id }">
      Contenu du résultat {{ id }}
    </template>
  </AmeliproAccordionResultList>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { AmeliproAccordionResultList } from '@cnamts/synapse'
  const items = [
    { id: 1, accordionTitle: 'Premier résultat' },
    { id: 2, accordionTitle: 'Deuxième résultat' },
    { id: 3, accordionTitle: 'Troisième résultat' },
  ]
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAccordionResultList },
		setup() { return { args } },
		template: `
<p class="mb-2">Le premier panneau est ouvert par défaut grâce à la prop <code>defaultItemOpened</code>.</p>
<AmeliproAccordionResultList v-bind="args">
  <template #headingContent="{ accordionTitle }">
    Header du {{ accordionTitle }}
  </template>
  <template #accordionContent="{ id }">
    Contenu du résultat {{ id }}
  </template>
</AmeliproAccordionResultList>
`,
	}),
}

// --- Pagination et tri (avec gestion de l'événement de tri) ---
export const PaginationEtTri: Story = {
	name: 'Pagination et tri',
	args: {
		items: Array.from({ length: 12 }, (_, i) => ({
			id: i + 1,
			accordionTitle: `Résultat ${i + 1}`,
		})),
		uniqueId: 'amelipro-accordion-result-list-pagination',
		title: 'Avec pagination et tri',
		itemsToDisplayDesktop: 4,
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
  <AmeliproAccordionResultList
    :items="sortedItems"
    unique-id="amelipro-accordion-result-list-pagination"
    title="Avec pagination et tri"
    :items-to-display-desktop="4"
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
    <template #headingContent="{ accordionTitle }">
      Header du {{ accordionTitle }}
    </template>
    <template #accordionContent="{ id }">
      Contenu du résultat {{ id }}
    </template>
  </AmeliproAccordionResultList>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref, computed } from 'vue'
import { AmeliproAccordionResultList } from '@cnamts/synapse'

const items = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  accordionTitle: \`Résultat \${i + 1}\`,
}))

const sortOrder = ref<'asc' | 'desc'>('asc')
const sortedItems = computed(() => {
  return [...items].sort((a, b) =>
    sortOrder.value === 'asc' ? a.id - b.id : b.id - a.id
  )
})

function onSortChange(val: 'asc' | 'desc') {
  sortOrder.value = val
}
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAccordionResultList },
		setup() {
			const items = Array.from({ length: 12 }, (_, i) => ({
				id: i + 1,
				accordionTitle: `Résultat ${i + 1}`,
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
<AmeliproAccordionResultList
  v-bind="args"
  :items="sortedItems"
  @change:sort-select="onSortChange"
>
  <template #headingContent="{ accordionTitle }">
    Header du {{ accordionTitle }}
  </template>
  <template #accordionContent="{ id }">
    Contenu du résultat {{ id }}
  </template>
</AmeliproAccordionResultList>
`,
	}),
}

// --- Bordure et couleur personnalisées ---
export const BordureEtCouleur: Story = {
	name: 'Bordure et couleur',
	args: {
		items: [
			{ id: 1, accordionTitle: 'Premier résultat' },
			{ id: 2, accordionTitle: 'Deuxième résultat' },
			{ id: 3, accordionTitle: 'Troisième résultat' },
		],
		uniqueId: 'amelipro-accordion-result-list-colored',
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
  <AmeliproAccordionResultList
    :items="items"
    unique-id="amelipro-accordion-result-list-colored"
    title="Bordure et couleur"
    group-bordered
    group-border-color="#1976d2"
    group-color="#e3f2fd"
  >
    <template #headingContent="{ accordionTitle }">
      Header du {{ accordionTitle }}
    </template>
    <template #accordionContent="{ id }">
      Contenu du résultat {{ id }}
    </template>
  </AmeliproAccordionResultList>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { AmeliproAccordionResultList } from '@cnamts/synapse'
  const items = [
    { id: 1, accordionTitle: 'Premier résultat' },
    { id: 2, accordionTitle: 'Deuxième résultat' },
    { id: 3, accordionTitle: 'Troisième résultat' },
  ]
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAccordionResultList },
		setup() { return { args } },
		template: `
<p class="mb-2">Les panneaux dépliants ont une bordure et une couleur de fond personnalisées grâce aux props <code>groupBordered</code>, <code>groupBorderColor</code> et <code>groupColor</code>.</p>
<AmeliproAccordionResultList v-bind="args">
  <template #headingContent="{ accordionTitle }">
    Header du {{ accordionTitle }}
  </template>
  <template #accordionContent="{ id }">
    Contenu du résultat {{ id }}
  </template>
</AmeliproAccordionResultList>
`,
	}),
}

// --- Séparateur masqué ---
export const SansSeparateur: Story = {
	name: 'Sans séparateur',
	args: {
		items: [
			{ id: 1, accordionTitle: 'Premier résultat' },
			{ id: 2, accordionTitle: 'Deuxième résultat' },
			{ id: 3, accordionTitle: 'Troisième résultat' },
		],
		uniqueId: 'amelipro-accordion-result-list-nosep',
		title: 'Sans séparateur',
		hideSeparator: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le séparateur entre le titre et le contenu est masqué grâce à la prop <code>hideSeparator</code>.</p>
  <AmeliproAccordionResultList
    :items="items"
    unique-id="amelipro-accordion-result-list-nosep"
    title="Sans séparateur"
    hide-separator
  >
    <template #headingContent="{ accordionTitle }">
      Header du {{ accordionTitle }}
    </template>
    <template #accordionContent="{ id }">
      Contenu du résultat {{ id }}
    </template>
  </AmeliproAccordionResultList>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { AmeliproAccordionResultList } from '@cnamts/synapse'
  const items = [
    { id: 1, accordionTitle: 'Premier résultat' },
    { id: 2, accordionTitle: 'Deuxième résultat' },
    { id: 3, accordionTitle: 'Troisième résultat' },
  ]
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAccordionResultList },
		setup() { return { args } },
		template: `
<p class="mb-2">Le séparateur entre le titre et le contenu est masqué grâce à la prop <code>hideSeparator</code>.</p>
<AmeliproAccordionResultList v-bind="args">
  <template #headingContent="{ accordionTitle }">
    Header du {{ accordionTitle }}
  </template>
  <template #accordionContent="{ id }">
    Contenu du résultat {{ id }}
  </template>
</AmeliproAccordionResultList>
`,
	}),
}

// --- Slot headingContent individuel ---
export const HeaderIndividuel: Story = {
	name: 'Header individuel',
	args: {
		items: [
			{ id: 1, accordionTitle: 'Premier résultat' },
			{ id: 2, accordionTitle: 'Deuxième résultat' },
		],
		uniqueId: 'amelipro-accordion-result-list-heading-per-item',
		title: 'Header individuel',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le slot <code>headingContent-1</code> permet d’ajouter un contenu spécifique à la partie droite du header du premier accordéon.</p>
  <AmeliproAccordionResultList
    :items="items"
    unique-id="amelipro-accordion-result-list-heading-per-item"
    title="Header individuel"
  >
    <template #headingContent="{ accordionTitle }">
      Header du {{ accordionTitle }}
    </template>
    <template #headingContent-1>
      <span style="color: #1976d2;">Header personnalisé pour le résultat 1</span>
    </template>
    <template #accordionContent="{ id }">
      Contenu du résultat {{ id }}
    </template>
  </AmeliproAccordionResultList>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { AmeliproAccordionResultList } from '@cnamts/synapse'
  const items = [
    { id: 1, accordionTitle: 'Premier résultat' },
    { id: 2, accordionTitle: 'Deuxième résultat' },
  ]
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAccordionResultList },
		setup() { return { args } },
		template: `
<p class="mb-2">Le slot <code>headingContent-1</code> permet d’ajouter un contenu spécifique à la partie droite du header du premier accordéon.</p>
<AmeliproAccordionResultList v-bind="args">
  <template #headingContent="{ accordionTitle }">
    Header du {{ accordionTitle }}
  </template>
  <template #headingContent-1>
    <span style="color: #1976d2;">Header personnalisé pour le résultat 1</span>
  </template>
  <template #accordionContent="{ id }">
    Contenu du résultat {{ id }}
  </template>
</AmeliproAccordionResultList>
`,
	}),
}

// --- Slot accordionContent individuel ---
export const ContenuIndividuel: Story = {
	name: 'Contenu individuel',
	args: {
		items: [
			{ id: 1, accordionTitle: 'Premier résultat' },
			{ id: 2, accordionTitle: 'Deuxième résultat' },
		],
		uniqueId: 'amelipro-accordion-result-list-content-per-item',
		title: 'Contenu individuel',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le slot <code>accordionContent-2</code> permet d’ajouter un contenu spécifique au deuxième accordéon.</p>
  <AmeliproAccordionResultList
    :items="items"
    unique-id="amelipro-accordion-result-list-content-per-item"
    title="Contenu individuel"
  >
    <template #headingContent="{ accordionTitle }">
      Header du {{ accordionTitle }}
    </template>
    <template #accordionContent-2>
      <strong>Contenu spécifique pour le résultat 2</strong>
    </template>
    <template #accordionContent="{ id }">
      <span v-if="id !== 2">Contenu générique pour le résultat {{ id }}</span>
    </template>
  </AmeliproAccordionResultList>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { AmeliproAccordionResultList } from '@cnamts/synapse'
  const items = [
    { id: 1, accordionTitle: 'Premier résultat' },
    { id: 2, accordionTitle: 'Deuxième résultat' },
  ]
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAccordionResultList },
		setup() { return { args } },
		template: `
<p class="mb-2">Le slot <code>accordionContent-2</code> permet d’ajouter un contenu spécifique au deuxième accordéon.</p>
<AmeliproAccordionResultList v-bind="args">
  <template #headingContent="{ accordionTitle }">
    Header du {{ accordionTitle }}
  </template>
  <template #accordionContent-2>
    <strong>Contenu spécifique pour le résultat 2</strong>
  </template>
    <template #accordionContent="{ id }">
    <span v-if="id !== 2">Contenu générique pour le résultat {{ id }}</span>
  </template>
</AmeliproAccordionResultList>
`,
	}),
}

// --- Masquage des labels ---
export const LabelsCaches: Story = {
	name: 'Labels cachés',
	args: {
		items: [
			{ id: 1, accordionTitle: 'Premier résultat' },
			{ id: 2, accordionTitle: 'Deuxième résultat' },
		],
		uniqueId: 'amelipro-accordion-result-list-hidden-labels',
		title: 'Labels cachés',
		hiddenLabels: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Les labels des champs select sont masqués grâce à la prop <code>hiddenLabels</code>.</p>
  <AmeliproAccordionResultList
    :items="items"
    unique-id="amelipro-accordion-result-list-hidden-labels"
    title="Labels cachés"
    hidden-labels
  >
    <template #headingContent="{ accordionTitle }">
      Header du {{ accordionTitle }}
    </template>
    <template #accordionContent="{ id }">
      Contenu du résultat {{ id }}
    </template>
  </AmeliproAccordionResultList>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { AmeliproAccordionResultList } from '@cnamts/synapse'
  const items = [
    { id: 1, accordionTitle: 'Premier résultat' },
    { id: 2, accordionTitle: 'Deuxième résultat' },
  ]
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAccordionResultList },
		setup() { return { args } },
		template: `
<p class="mb-2">Les labels des champs select sont masqués grâce à la prop <code>hiddenLabels</code>.</p>
<AmeliproAccordionResultList v-bind="args">
  <template #headingContent="{ accordionTitle }">
      Header du {{ accordionTitle }}
    </template>
    <template #accordionContent="{ id }">
    Contenu du résultat {{ id }}
  </template>
</AmeliproAccordionResultList>
`,
	}),
}
