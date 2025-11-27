import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproCard from '../AmeliproCard/AmeliproCard.vue'
import AmeliproResultList from './AmeliproResultList.vue'
import type { IDataListItem } from '../types'
import { computed, ref } from 'vue'

const meta = {
	argTypes: {
		'`result-${item.id}`': { description: 'Slot individuel si tous vos résultats ne sont pas basés sur le même gabarit' },
		'change:pagination-select': { description: 'Événement émis à la sélection d’un nombre de résultats par page. Émet le nombre de résultat par page sélectionné', type: 'number' },
		'change:sort-select': { description: 'Événement émis à la sélection d’un tri. Émet le choix de tri sélectionné', type: '' },
		'click': { description: 'Événement émis au click sur un bouton de pagination', type: 'void' },
		'counterLabel': { description: 'Label du compteur de résultats en haut de la liste de résultats' },
		'hiddenLabels': { description: 'Masque les labels des champs select' },
		'items': {
			description: 'Tableau comprenant la liste des résultats',
			table: {
				type: {
					detail: `Array<{
	id: number,
	[key: string]: string,
}>`,
					summary: 'IDataListItem[]',
				},
			},
		},
		'itemsToDisplayDesktop': { description: 'Nombre d’éléments affichés par page en desktop par défaut' },
		'itemsToDisplayMobile': { description: 'Nombre d’éléments affichés par page en mobile par défaut' },
		'noResultListInfos': { description: 'Masques les informations et les filtres au-dessus de la liste de résultats' },
		'paginationSelect': { description: 'Affiche le select nombre de résultat par page' },
		'paginationSelectLabel': { description: 'Label du select de pagination' },
		'paginationSelectPlaceholder': { description: 'Placeholder du select de pagination' },
		'result': { description: 'Slot générique permettant de donner le même aspect à tout les items de votre liste' },
		'sortSelect': { description: 'Affiche le select de tri' },
		'sortSelectDefaultValue': {
			description: 'valeur par défaut sélectionnée dans le select dédié aux tris',
			control: 'text',
		},
		'sortSelectItems': { description: 'Items du select dédié aux tris' },
		'sortSelectLabel': { description: 'Label du select de tri' },
		'sortSelectPlaceholder': { description: 'Placeholder du select de tri' },
		'title': { description: 'Titre de la liste' },
		'uniqueId': { description: 'Identifiant unique de la liste' },
	},
	component: AmeliproResultList,
	title: 'Composants/Amelipro/Listes de résultats/AmeliproResultList',
} as Meta<typeof AmeliproResultList>
export default meta

type Story = StoryObj<typeof AmeliproResultList>

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
		title: 'Exemple de liste de résultats',
		uniqueId: 'amelipro-result-list-id',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproResultList
		:items="items"
		title="Exemple de liste de résultats"
		unique-id="amelipro-result-list-id"
	>
		<template #result="item">
			<AmeliproCard
				:card-title="[\`Titre de carte \${item.id + 1}\`]"
				class="mb-2"
				:unique-id="[\`result-list-card-\${item.id}\`]"
			>
				<p>{{ item.firstname }} {{ item.name }}</p>

				<p>{{ item.email }}</p>
			</AmeliproCard>
		</template>
	</AmeliproResultList>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproResultList } from '@cnamts/synapse'

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
</script>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproResultList, AmeliproCard },
		setup() {
			return { args }
		},
		template: `
<div>
<AmeliproResultList
	v-bind="args"
>
	<template #result="item">
		<AmeliproCard
			:card-title="\`Titre de carte \${item.id + 1}\`"
			class="mb-2"
			:unique-id="[\`result-list-card-\${item.id}\`]"
		>
			<p>{{ item.firstname }} {{ item.name }}</p>

			<p>{{ item.email }}</p>
		</AmeliproCard>
	</template>
</AmeliproResultList>
</div>
		`,
	}),

}

// --- Pagination et tri (avec gestion de l'événement de tri) ---
export const PaginationEtTri: Story = {
	name: 'Pagination et tri',
	args: {
		items,
		uniqueId: 'amelipro-result-list-pagination',
		title: 'Avec pagination et tri',
		itemsToDisplayDesktop: 4,
		itemsToDisplayMobile: 2,
		sortSelectDefaultValue: 'desc',
		sortSelectItems: [
			{ title: 'Nom croissant', value: 'asc' },
			{ title: 'Nom décroissant', value: 'desc' },
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
  <AmeliproResultList
    :items="sortedItems"
    unique-id="amelipro-result-list-pagination"
    title="Avec pagination et tri"
    :items-to-display-desktop="4"
    :items-to-display-mobile="2"
	sort-select-default-value="desc"
    :sort-select-items="[
      { title: 'Nom croissant', value: 'asc' },
      { title: 'Nom décroissant', value: 'desc' }
    ]"
    sort-select-label="Trier par :"
    sort-select-placeholder="Choisir un ordre"
    @change:sort-select="onSortChange"
  >
    <template #result="item">
      <AmeliproCard
        :card-title="\`Titre de carte \${item.id + 1}\`"
        class="mb-2"
        :unique-id="\`result-list-card-\${item.id}\`"
      >
        <p>{{ item.firstname }} {{ item.name }}</p>
        <p>{{ item.email }}</p>
      </AmeliproCard>
    </template>
  </AmeliproResultList>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref, computed } from 'vue'
import { AmeliproResultList } from '@cnamts/synapse'
import AmeliproCard from '../AmeliproCard/AmeliproCard.vue'

const items = [
  // ... même tableau que dans Default ...
]

const sortOrder = ref<'asc' | 'desc'>('asc')
const sortedItems = computed(() =>
	[...(args.items ?? [])].sort((a, b) =>
		sortOrder.value === 'asc'
			? String(a.name).localeCompare(String(b.name))
			: String(b.name).localeCompare(String(a.name)),
	),
)

function onSortChange(val: 'asc' | 'desc') {
  sortOrder.value = val
}
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproResultList, AmeliproCard },
		setup() {
			const sortOrder = ref<'asc' | 'desc'>('asc')
			const sortedItems = computed(() =>
				[...(args.items ?? [])].sort((a, b) =>
					sortOrder.value === 'asc'
						? String(a.name).localeCompare(String(b.name))
						: String(b.name).localeCompare(String(a.name)),
				),
			)
			function onSortChange(val: 'asc' | 'desc') {
				sortOrder.value = val
			}
			return { args, sortedItems, onSortChange }
		},
		template: `
<p class="mb-2">Pagination et tri sont activés grâce aux props <code>itemsToDisplayDesktop</code>, <code>itemsToDisplayMobile</code> et <code>sortSelectItems</code>. Le tri est effectif grâce à la gestion de l’événement <code>change:sort-select</code>.</p>
<AmeliproResultList
  v-bind="args"
  :items="sortedItems"
  @change:sort-select="onSortChange"
>
  <template #result="item">
    <AmeliproCard
      :card-title="\`Titre de carte \${item.id + 1}\`"
      class="mb-2"
      :unique-id="\`result-list-card-\${item.id}\`"
    >
      <p>{{ item.firstname }} {{ item.name }}</p>
      <p>{{ item.email }}</p>
    </AmeliproCard>
  </template>
</AmeliproResultList>
`,
	}),
}

// --- Slot individuel pour un résultat ---
export const ResultatIndividuel: Story = {
	name: 'Résultat individuel',
	args: {
		items,
		uniqueId: 'amelipro-result-list-individuel',
		title: 'Slot individuel',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le slot <code>result-1</code> permet d’ajouter un rendu spécifique pour le résultat d’id 1.</p>
  <AmeliproResultList
    :items="items"
    unique-id="amelipro-result-list-individuel"
    title="Slot individuel"
  >
    <template #result-1="item">
      <AmeliproCard
        card-title="Carte personnalisée"
        class="mb-2"
        :unique-id="'result-list-card-1'"
      >
        <p>Contenu spécifique pour {{ item.firstname }} {{ item.name }}</p>
        <p>{{ item.email }}</p>
      </AmeliproCard>
    </template>
    <template #result="item">
      <AmeliproCard
        :card-title="\`Titre de carte \${item.id + 1}\`"
        class="mb-2"
        :unique-id="\`result-list-card-\${item.id}\`"
      >
        <p>{{ item.firstname }} {{ item.name }}</p>
        <p>{{ item.email }}</p>
      </AmeliproCard>
    </template>
  </AmeliproResultList>
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproResultList, AmeliproCard },
		setup() { return { args } },
		template: `
<p class="mb-2">Le slot <code>result-1</code> permet d’ajouter un rendu spécifique pour le résultat d’id 1.</p>
<AmeliproResultList v-bind="args">
  <template #result-1="item">
    <AmeliproCard
      card-title="Carte personnalisée"
      class="mb-2"
      :unique-id="'result-list-card-1'"
    >
      <p>Contenu spécifique pour {{ item.firstname }} {{ item.name }}</p>
      <p>{{ item.email }}</p>
    </AmeliproCard>
  </template>
  <template #result="item">
    <AmeliproCard
      :card-title="\`Titre de carte \${item.id + 1}\`"
      class="mb-2"
      :unique-id="\`result-list-card-\${item.id}\`"
    >
      <p>{{ item.firstname }} {{ item.name }}</p>
      <p>{{ item.email }}</p>
    </AmeliproCard>
  </template>
</AmeliproResultList>
`,
	}),
}

// --- Masquage des labels ---
export const LabelsCaches: Story = {
	name: 'Labels cachés',
	args: {
		items,
		uniqueId: 'amelipro-result-list-hidden-labels',
		title: 'Labels cachés',
		hiddenLabels: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Les labels des champs select sont masqués grâce à la prop <code>hiddenLabels</code>.</p>
  <AmeliproResultList
    :items="items"
    unique-id="amelipro-result-list-hidden-labels"
    title="Labels cachés"
    hidden-labels
  >
    <template #result="item">
      <AmeliproCard
        :card-title="\`Titre de carte \${item.id + 1}\`"
        class="mb-2"
        :unique-id="\`result-list-card-\${item.id}\`"
      >
        <p>{{ item.firstname }} {{ item.name }}</p>
        <p>{{ item.email }}</p>
      </AmeliproCard>
    </template>
  </AmeliproResultList>
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproResultList, AmeliproCard },
		setup() { return { args } },
		template: `
<p class="mb-2">Les labels des champs select sont masqués grâce à la prop <code>hiddenLabels</code>.</p>
<AmeliproResultList v-bind="args">
  <template #result="item">
    <AmeliproCard
      :card-title="\`Titre de carte \${item.id + 1}\`"
      class="mb-2"
      :unique-id="\`result-list-card-\${item.id}\`"
    >
      <p>{{ item.firstname }} {{ item.name }}</p>
      <p>{{ item.email }}</p>
    </AmeliproCard>
  </template>
</AmeliproResultList>
`,
	}),
}

// --- Masquage des infos de liste ---
export const SansInfosListe: Story = {
	name: 'Sans infos de liste',
	args: {
		items,
		uniqueId: 'amelipro-result-list-no-infos',
		title: 'Sans infos de liste',
		noResultListInfos: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Les informations et filtres au-dessus de la liste sont masqués grâce à la prop <code>noResultListInfos</code>.</p>
  <AmeliproResultList
    :items="items"
    unique-id="amelipro-result-list-no-infos"
    title="Sans infos de liste"
    no-result-list-infos
  >
    <template #result="item">
      <AmeliproCard
        :card-title="\`Titre de carte \${item.id + 1}\`"
        class="mb-2"
        :unique-id="\`result-list-card-\${item.id}\`"
      >
        <p>{{ item.firstname }} {{ item.name }}</p>
        <p>{{ item.email }}</p>
      </AmeliproCard>
    </template>
  </AmeliproResultList>
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproResultList, AmeliproCard },
		setup() { return { args } },
		template: `
<p class="mb-2">Les informations et filtres au-dessus de la liste sont masqués grâce à la prop <code>noResultListInfos</code>.</p>
<AmeliproResultList v-bind="args">
  <template #result="item">
    <AmeliproCard
      :card-title="\`Titre de carte \${item.id + 1}\`"
      class="mb-2"
      :unique-id="\`result-list-card-\${item.id}\`"
    >
      <p>{{ item.firstname }} {{ item.name }}</p>
      <p>{{ item.email }}</p>
    </AmeliproCard>
  </template>
</AmeliproResultList>
`,
	}),
}

// --- Sélection du nombre de résultats par page (paginationSelect) ---
export const PaginationSelect: Story = {
	name: 'Sélecteur de pagination',
	args: {
		items,
		uniqueId: 'amelipro-result-list-pagination-select',
		title: 'Sélecteur de pagination',
		paginationSelect: true,
		itemsToDisplayDesktop: 3,
		itemsToDisplayMobile: 2,
		paginationSelectLabel: 'Résultats par page :',
		paginationSelectPlaceholder: 'Sélectionner...',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Affichage du sélecteur du nombre de résultats par page grâce à la prop <code>paginationSelect</code>.</p>
  <AmeliproResultList
    :items="items"
    unique-id="amelipro-result-list-pagination-select"
    title="Sélecteur de pagination"
    pagination-select
    :items-to-display-desktop="3"
    :items-to-display-mobile="2"
    pagination-select-label="Résultats par page :"
    pagination-select-placeholder="Sélectionner..."
  >
    <template #result="item">
      <AmeliproCard
        :card-title="\`Titre de carte \${item.id + 1}\`"
        class="mb-2"
        :unique-id="\`result-list-card-\${item.id}\`"
      >
        <p>{{ item.firstname }} {{ item.name }}</p>
        <p>{{ item.email }}</p>
      </AmeliproCard>
    </template>
  </AmeliproResultList>
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproResultList, AmeliproCard },
		setup() { return { args } },
		template: `
<p class="mb-2">Affichage du sélecteur du nombre de résultats par page grâce à la prop <code>paginationSelect</code>.</p>
<AmeliproResultList v-bind="args">
  <template #result="item">
    <AmeliproCard
      :card-title="\`Titre de carte \${item.id + 1}\`"
      class="mb-2"
      :unique-id="\`result-list-card-\${item.id}\`"
    >
      <p>{{ item.firstname }} {{ item.name }}</p>
      <p>{{ item.email }}</p>
    </AmeliproCard>
  </template>
</AmeliproResultList>
`,
	}),
}

// --- Compteur personnalisé ---
export const CompteurPersonnalise: Story = {
	name: 'Compteur personnalisé',
	args: {
		items,
		uniqueId: 'amelipro-result-list-counter-label',
		title: 'Compteur personnalisé',
		counterLabel: 'Nombre de résultats trouvés :',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le compteur de résultats est personnalisé grâce à la prop <code>counterLabel</code>.</p>
  <AmeliproResultList
    :items="items"
    unique-id="amelipro-result-list-counter-label"
    title="Compteur personnalisé"
    counter-label="Nombre de résultats trouvés :"
  >
    <template #result="item">
      <AmeliproCard
        :card-title="\`Titre de carte \${item.id + 1}\`"
        class="mb-2"
        :unique-id="\`result-list-card-\${item.id}\`"
      >
        <p>{{ item.firstname }} {{ item.name }}</p>
        <p>{{ item.email }}</p>
      </AmeliproCard>
    </template>
  </AmeliproResultList>
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproResultList, AmeliproCard },
		setup() { return { args } },
		template: `
<p class="mb-2">Le compteur de résultats est personnalisé grâce à la prop <code>counterLabel</code>.</p>
<AmeliproResultList v-bind="args">
  <template #result="item">
    <AmeliproCard
      :card-title="\`Titre de carte \${item.id + 1}\`"
      class="mb-2"
      :unique-id="\`result-list-card-\${item.id}\`"
    >
      <p>{{ item.firstname }} {{ item.name }}</p>
      <p>{{ item.email }}</p>
    </AmeliproCard>
  </template>
</AmeliproResultList>
`,
	}),
}

// --- Placeholder et label personnalisés pour la pagination ---
export const PaginationLabelPlaceholder: Story = {
	name: 'Label et placeholder pagination',
	args: {
		items,
		uniqueId: 'amelipro-result-list-pagination-label-placeholder',
		title: 'Label et placeholder pagination',
		paginationSelect: true,
		paginationSelectLabel: 'Afficher :',
		paginationSelectPlaceholder: 'Choisissez...',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Personnalisation du label et du placeholder du select de pagination.</p>
  <AmeliproResultList
    :items="items"
    unique-id="amelipro-result-list-pagination-label-placeholder"
    title="Label et placeholder pagination"
    pagination-select
    pagination-select-label="Afficher :"
    pagination-select-placeholder="Choisissez..."
  >
    <template #result="item">
      <AmeliproCard
        :card-title="\`Titre de carte \${item.id + 1}\`"
        class="mb-2"
        :unique-id="\`result-list-card-\${item.id}\`"
      >
        <p>{{ item.firstname }} {{ item.name }}</p>
        <p>{{ item.email }}</p>
      </AmeliproCard>
    </template>
  </AmeliproResultList>
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproResultList, AmeliproCard },
		setup() { return { args } },
		template: `
<p class="mb-2">Personnalisation du label et du placeholder du select de pagination.</p>
<AmeliproResultList v-bind="args">
  <template #result="item">
    <AmeliproCard
      :card-title="\`Titre de carte \${item.id + 1}\`"
      class="mb-2"
      :unique-id="\`result-list-card-\${item.id}\`"
    >
      <p>{{ item.firstname }} {{ item.name }}</p>
      <p>{{ item.email }}</p>
    </AmeliproCard>
  </template>
</AmeliproResultList>
`,
	}),
}

// --- Liste vide ---
export const ListeVide: Story = {
	name: 'Liste vide',
	args: {
		items: [],
		uniqueId: 'amelipro-result-list-empty',
		title: 'Aucun résultat',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Affichage du composant avec une liste vide.</p>
  <AmeliproResultList
    :items="[]"
    unique-id="amelipro-result-list-empty"
    title="Aucun résultat"
  />  
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproResultList },
		setup() { return { args } },
		template: `
<p class="mb-2">Affichage du composant avec une liste vide.</p>
<AmeliproResultList v-bind="args" />
`,
	}),
}

// --- Slot générique sans carte ---
export const ResultatSansCarte: Story = {
	name: 'Résultat sans carte',
	args: {
		items,
		uniqueId: 'amelipro-result-list-no-card',
		title: 'Résultat sans carte',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Affichage d’un résultat personnalisé sans carte via le slot <code>result</code>.</p>
  <AmeliproResultList
    :items="items"
    unique-id="amelipro-result-list-no-card"
    title="Résultat sans carte"
  >
    <template #result="item">
      <div style="border: 1px solid #1976d2; padding: 8px; margin-bottom: 8px;">
        <strong>{{ item.firstname }} {{ item.name }}</strong> — {{ item.email }}
      </div>
    </template>
  </AmeliproResultList>
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproResultList },
		setup() { return { args } },
		template: `
<p class="mb-2">Affichage d’un résultat personnalisé sans carte via le slot <code>result</code>.</p>
<AmeliproResultList v-bind="args">
  <template #result="item">
    <div style="border: 1px solid #1976d2; padding: 8px; margin-bottom: 8px;">
      <strong>{{ item.firstname }} {{ item.name }}</strong> — {{ item.email }}
    </div>
  </template>
</AmeliproResultList>
`,
	}),
}

// --- Exemple combiné (toutes options) ---
export const ExempleCombine: Story = {
	name: 'Exemple combiné',
	args: {
		items,
		uniqueId: 'amelipro-result-list-combine',
		title: 'Exemple combiné',
		paginationSelect: true,
		paginationSelectLabel: 'Résultats par page :',
		paginationSelectPlaceholder: 'Sélectionner...',
		sortSelectItems: [
			{ title: 'Nom croissant', value: 'asc' },
			{ title: 'Nom décroissant', value: 'desc' },
		],
		sortSelectLabel: 'Trier par :',
		sortSelectPlaceholder: 'Choisir un ordre',
		counterLabel: 'Nombre de résultats :',
		hiddenLabels: true,
		noResultListInfos: true,
		itemsToDisplayDesktop: 3,
		itemsToDisplayMobile: 2,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Exemple combinant tri, pagination, labels cachés, infos masquées et slot individuel.</p>
  <AmeliproResultList
    :items="items"
    unique-id="amelipro-result-list-combine"
    title="Exemple combiné"
    pagination-select
    pagination-select-label="Résultats par page :"
    pagination-select-placeholder="Sélectionner..."
    :sort-select-items="[
      { title: 'Nom croissant', value: 'asc' },
      { title: 'Nom décroissant', value: 'desc' }
    ]"
    sort-select-label="Trier par :"
    sort-select-placeholder="Choisir un ordre"
    counter-label="Nombre de résultats :"
    hidden-labels
    no-result-list-infos
    :items-to-display-desktop="3"
    :items-to-display-mobile="2"
  >
    <template #result-0="item">
      <div style="background: #e3f2fd; padding: 8px; margin-bottom: 8px;">
        <strong>Résultat spécial :</strong> {{ item.firstname }} {{ item.name }}
      </div>
    </template>
    <template #result="item">
      <div style="border: 1px solid #1976d2; padding: 8px; margin-bottom: 8px;">
        <strong>{{ item.firstname }} {{ item.name }}</strong> — {{ item.email }}
      </div>
    </template>
  </AmeliproResultList>
</template>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproResultList },
		setup() { return { args } },
		template: `
<p class="mb-2">Exemple combinant tri, pagination, labels cachés, infos masquées et slot individuel.</p>
<AmeliproResultList v-bind="args">
  <template #result-0="item">
    <div style="background: #e3f2fd; padding: 8px; margin-bottom: 8px;">
      <strong>Résultat spécial :</strong> {{ item.firstname }} {{ item.name }}
    </div>
  </template>
  <template #result="item">
    <div style="border: 1px solid #1976d2; padding: 8px; margin-bottom: 8px;">
      <strong>{{ item.firstname }} {{ item.name }}</strong> — {{ item.email }}
    </div>
  </template>
</AmeliproResultList>
`,
	}),
}
