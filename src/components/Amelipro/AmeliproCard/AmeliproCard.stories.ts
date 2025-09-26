import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproCard from './AmeliproCard.vue'

const meta = {
	argTypes: {
		borderColor: { description: 'Couleur des bordures de la card' },
		bordered: { description: 'Permet d’activer ou de desactiver les bordures de la card' },
		cardColor: { description: 'Couleur du background de la card' },
		cardTitle: { description: 'Valeur du titre de la card' },
		classes: { description: 'Classes personnalisée de la card' },
		contentClasses: { description: 'Partie droite du header du panneau dépliant' },
		default: { description: 'Contenu de la card' },
		divider: { description: 'Permet d’activer ou de desactiver le divider de la card entre le titre et le contenu' },
		fullSizeImg: { description: 'Slot permettant d’ajouter une image qui couvre toute la largeur du bloc entre le header et le contenu' },
		headerLeft: { description: 'Titre de la card' },
		headerRight: { description: 'Header droit de la card' },
		headerRightWidth: { description: 'Défini la largeur de la partie droite des headers des cartes. Cette props est utile seulement si le slot accordion-header-right est utilisé' },
		noCardHeader: { description: 'Permet de supprimer la partie header de la card' },
		rightPart: { description: 'Permet de créer un encart à droite de la card' },
		rightPartClasses: { description: 'Permet des classes sur l’encart à droite de la card' },
		rightPartContent: { description: 'Contenu de la partie droite de la carte, ne sert que si la propriété rightPart est activée' },
		rightPartWidth: { description: 'Permet de gérer la largeur l’encart à droite de la card' },
		titleColor: { description: 'Couleur du titre de la card' },
		titleLevel: { description: 'Permet de changer le niveau du titre' },
		uniqueId: { description: 'Identifiant unique de la carte' },

	},
	component: AmeliproCard,
	title: 'Composants/Amelipro/Cartes/AmeliproCard',
} as Meta<typeof AmeliproCard>
export default meta

type Story = StoryObj<typeof AmeliproCard>

export const Default: Story = {
	args: {
		cardTitle: 'Mon titre',
		default: '[Slot: default]',
		headerRight: '[Slot: headerRight]',
		uniqueId: 'amelipro-card-unique-id',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproCard
		card-title="Mon titre"
		unique-id="amelipro-card-unique-id"
	>
		<template #headerRight>
			<p class="mb-0">
				[Slot: headerRight]
			</p>
		</template>

		<template #default>
			<p class="mb-0">
				[Slot: default]
			</p>
		</template>
	</AmeliproCard>
</template>`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
	import { AmeliproCard } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCard },
		setup() {
			return { args }
		},
		template: `
<AmeliproCard
	v-bind="args"
>
	<template #headerRight>
		<p class="mb-0">
			[Slot: headerRight]
		</p>
	</template>

	<template #default>
		<p class="mb-0">
			[Slot: default]
		</p>
	</template>
</AmeliproCard>`,
	}),
}

// --- Carte sans header ---
export const SansHeader: Story = {
	name: 'Sans header',
	args: {
		cardTitle: 'Titre masqué',
		default: '[Slot: default]',
		noCardHeader: true,
		uniqueId: 'amelipro-card-no-header',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>La prop <code>noCardHeader</code> masque le header de la carte.</p>
  <AmeliproCard
    card-title="Titre masqué"
    no-card-header
    unique-id="amelipro-card-no-header"
  >
    <template #default>
      <p class="mb-0">[Slot: default]</p>
    </template>
  </AmeliproCard>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { AmeliproCard } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCard },
		setup() { return { args } },
		template: `
<p class="mb-2">La prop <code>noCardHeader</code> masque le header de la carte.</p>
<AmeliproCard v-bind="args">
  <template #default>
    <p class="mb-0">[Slot: default]</p>
  </template>
</AmeliproCard>
`,
	}),
}

// --- Carte avec bordure et couleur personnalisées ---
export const BordureEtCouleur: Story = {
	name: 'Bordure et couleur',
	args: {
		cardTitle: 'Carte colorée',
		default: '[Slot: default]',
		bordered: true,
		borderColor: '#1976d2',
		cardColor: '#e3f2fd',
		uniqueId: 'amelipro-card-colored',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>La carte possède une bordure et une couleur de fond personnalisées grâce aux props <code>bordered</code>, <code>borderColor</code> et <code>cardColor</code>.</p>
  <AmeliproCard
    card-title="Carte colorée"
    bordered
    border-color="#1976d2"
    card-color="#e3f2fd"
    unique-id="amelipro-card-colored"
  >
    <template #default>
      <p class="mb-0">[Slot: default]</p>
    </template>
  </AmeliproCard>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { AmeliproCard } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCard },
		setup() { return { args } },
		template: `
<p class="mb-2">La carte possède une bordure et une couleur de fond personnalisées grâce aux props <code>bordered</code>, <code>borderColor</code> et <code>cardColor</code>.</p>
<AmeliproCard v-bind="args">
  <template #default>
    <p class="mb-0">[Slot: default]</p>
  </template>
</AmeliproCard>
`,
	}),
}

// --- Carte avec slot headerLeft et headerRight ---
export const HeaderGaucheDroite: Story = {
	name: 'Header gauche et droite',
	args: {
		cardTitle: 'Titre principal',
		default: '[Slot: default]',
		uniqueId: 'amelipro-card-header-left-right',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Utilisation des slots <code>headerLeft</code> et <code>headerRight</code> pour personnaliser les deux parties du header.</p>
  <AmeliproCard
    card-title="Titre principal"
    unique-id="amelipro-card-header-left-right"
  >
    <template #headerLeft>
      <span style="color: #1976d2;">[Slot: headerLeft]</span>
    </template>
    <template #headerRight>
      <span style="color: #388e3c;">[Slot: headerRight]</span>
    </template>
    <template #default>
      <p class="mb-0">[Slot: default]</p>
    </template>
  </AmeliproCard>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { AmeliproCard } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCard },
		setup() { return { args } },
		template: `
<p class="mb-2">Utilisation des slots <code>headerLeft</code> et <code>headerRight</code> pour personnaliser les deux parties du header.</p>
<AmeliproCard v-bind="args">
  <template #headerLeft>
    <span style="color: #1976d2;">[Slot: headerLeft]</span>
  </template>
  <template #headerRight>
    <span style="color: #388e3c;">[Slot: headerRight]</span>
  </template>
  <template #default>
    <p class="mb-0">[Slot: default]</p>
  </template>
</AmeliproCard>
`,
	}),
}

// --- Carte avec encart à droite ---
export const EncartDroit: Story = {
	name: 'Encart à droite',
	args: {
		cardTitle: 'Carte avec encart',
		default: '[Slot: default]',
		rightPart: true,
		rightPartContent: 'Contenu encart',
		rightPartWidth: '120px',
		uniqueId: 'amelipro-card-right-part',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>La prop <code>rightPart</code> active un encart à droite de la carte, personnalisable avec <code>rightPartContent</code> et <code>rightPartWidth</code>.</p>
  <AmeliproCard
    card-title="Carte avec encart"
    right-part
    right-part-content="Contenu encart"
    :right-part-width="120"
    unique-id="amelipro-card-right-part"
  >
    <template #default>
      <p class="mb-0">[Slot: default]</p>
    </template>
  </AmeliproCard>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { AmeliproCard } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCard },
		setup() { return { args } },
		template: `
<p class="mb-2">La prop <code>rightPart</code> active un encart à droite de la carte, personnalisable avec <code>rightPartContent</code> et <code>rightPartWidth</code>.</p>
<AmeliproCard v-bind="args">
  <template #default>
    <p class="mb-0">[Slot: default]</p>
  </template>
</AmeliproCard>
`,
	}),
}

// --- Carte avec image pleine largeur (slot fullSizeImg) ---
export const ImagePleineLargeur: Story = {
	name: 'Image pleine largeur',
	args: {
		cardTitle: 'Carte avec image',
		default: '[Slot: default]',
		uniqueId: 'amelipro-card-full-img',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le slot <code>fullSizeImg</code> permet d’ajouter une image qui couvre toute la largeur de la carte.</p>
  <AmeliproCard
    card-title="Carte avec image"
    unique-id="amelipro-card-full-img"
  >
    <template #fullSizeImg>
      <img src="/ameli-pro.svg" alt="Image large" style="width: 100%;" />
    </template>
    <template #default>
      <p class="mb-0">[Slot: default]</p>
    </template>
  </AmeliproCard>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { AmeliproCard } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCard },
		setup() { return { args } },
		template: `
<p class="mb-2">Le slot <code>fullSizeImg</code> permet d’ajouter une image qui couvre toute la largeur de la carte.</p>
<AmeliproCard v-bind="args">
  <template #fullSizeImg>
    <img src="/ameli-pro.svg" alt="Image large" style="width: 100%;" />
  </template>
  <template #default>
    <p class="mb-0">[Slot: default]</p>
  </template>
</AmeliproCard>
`,
	}),
}

// --- Carte sans divider ---
export const SansDivider: Story = {
	name: 'Sans divider',
	args: {
		cardTitle: 'Carte sans divider',
		default: '[Slot: default]',
		divider: false,
		uniqueId: 'amelipro-card-no-divider',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>La prop <code>divider</code> à <code>false</code> supprime la séparation entre le header et le contenu.</p>
  <AmeliproCard
    card-title="Carte sans divider"
    :divider="false"
    unique-id="amelipro-card-no-divider"
  >
    <template #default>
      <p class="mb-0">[Slot: default]</p>
    </template>
  </AmeliproCard>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { AmeliproCard } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCard },
		setup() { return { args } },
		template: `
<p class="mb-2">La prop <code>divider</code> à <code>false</code> supprime la séparation entre le header et le contenu.</p>
<AmeliproCard v-bind="args">
  <template #default>
    <p class="mb-0">[Slot: default]</p>
  </template>
</AmeliproCard>
`,
	}),
}

// --- Carte avec niveau de titre et couleur personnalisés ---
export const TitreNiveauEtCouleur: Story = {
	name: 'Titre niveau et couleur',
	args: {
		cardTitle: 'Titre personnalisé',
		titleLevel: 3,
		titleColor: '#1976d2',
		default: '[Slot: default]',
		uniqueId: 'amelipro-card-title-level-color',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le niveau et la couleur du titre sont personnalisés grâce aux props <code>titleLevel</code> et <code>titleColor</code>.</p>
  <AmeliproCard
    card-title="Titre personnalisé"
    :title-level="3"
    title-color="#1976d2"
    unique-id="amelipro-card-title-level-color"
  >
    <template #default>
      <p class="mb-0">[Slot: default]</p>
    </template>
  </AmeliproCard>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { AmeliproCard } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCard },
		setup() { return { args } },
		template: `
<p class="mb-2">Le niveau et la couleur du titre sont personnalisés grâce aux props <code>titleLevel</code> et <code>titleColor</code>.</p>
<AmeliproCard v-bind="args">
  <template #default>
    <p class="mb-0">[Slot: default]</p>
  </template>
</AmeliproCard>
`,
	}),
}
