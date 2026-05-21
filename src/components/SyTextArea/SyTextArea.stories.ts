import type { Meta, StoryObj } from '@storybook/vue3'
import SyTextArea from './SyTextArea.vue'
import type { VTextarea } from 'vuetify/components'
import { fn } from '@storybook/test'
import { ref, onMounted, nextTick } from 'vue'
import { getValidationDocumentation } from '@/composables/unifyValidation/documentationValidationProps'

const meta = {
	title: 'Composants/Formulaires/SyTextArea',
	component: SyTextArea,
	parameters: {
		docs: {
			controls: {
				exclude: ['validateOn', 'update:modelValue', 'onUpdate:modelValue'],
			},
		},
		controls: {
			exclude: ['validateOn', 'onUpdate:modelValue'],
		},
	},
	argTypes: {
		...getValidationDocumentation('string'),
		uniqueId: {
			control: { type: 'text' },
			description: 'Identifiant unique du composant',
			table: {
				type: { summary: 'string' },
				defaultValue: { summary: 'undefined' },
				category: 'props',
			},
		},
		label: {
			control: { type: 'text' },
			description: 'Texte affiché au-dessus du champ',
			table: {
				type: { summary: 'string' },
				defaultValue: { summary: 'undefined' },
				category: 'props',
			},
		},
		trim: {
			control: { type: 'boolean' },
			description: 'Supprime les espaces en début et fin de chaîne de caractères',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		replaceTabs: {
			control: { type: 'number' },
			description: 'Remplace les tabulations par un nombre défini d\'espaces',
			table: {
				type: { summary: 'number' },
				defaultValue: { summary: 'undefined' },
			},
		},
		maxLines: {
			control: { type: 'number' },
			description: 'Nombre maximum de lignes acceptées',
			table: {
				type: { summary: 'number' },
				defaultValue: { summary: 'undefined' },
			},
		},
		autoWrap: {
			control: { type: 'number' },
			description: 'Nombre de caractères maximum par ligne',
			table: {
				type: { summary: 'number' },
				defaultValue: { summary: 'undefined' },
			},
		},
		normalize: {
			control: { type: 'boolean' },
			description: 'Normalise le texte selon la norme NFC',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
			},
		},
		color: {
			control: { type: 'text' },
			description: 'Couleur du champ',
			table: {
				type: { summary: 'string' },
				defaultValue: { summary: 'primary' },
			},
		},
		variant: {
			control: { type: 'select' },
			options: ['filled', 'outlined', 'underlined'],
			description: 'Type de champ',
			table: {
				type: { summary: 'string' },
				defaultValue: { summary: 'outlined' },
			},
		},
		clearable: {
			control: { type: 'boolean' },
			description: 'Affiche un bouton pour vider le champ',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
				category: 'props',
			},
		},
		helpText: {
			control: { type: 'text' },
			description: 'Texte d\'aide affiché sous le champ en l\'absence de messages de validation',
			table: {
				type: { summary: 'string' },
				defaultValue: { summary: '' },
				category: 'props',
			},
		},
		hideDetails: {
			control: { type: 'boolean' },
			description: 'Masque la zone des messages (erreurs, aide…)',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
				category: 'props',
			},
		},
		displayAsterisk: {
			control: { type: 'boolean' },
			description: 'Affiche un astérisque après le label quand le champ est requis',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
				category: 'props',
			},
		},
	},
} satisfies Meta<typeof SyTextArea & typeof VTextarea>

export default meta
type Story = StoryObj<Meta<typeof SyTextArea & typeof VTextarea>>

export const Default: Story = {
	args: {
		'label': 'Texte',
		'onUpdate:modelValue': fn(),
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<SyTextArea
		uniqueId: 'text-area-unique-id',
		v-model="text"
		label="Texte"
		placeholder="Entrez votre texte ici"
		style="width: 100%"
	></SyTextArea>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
const text = ref('')
</script>
				`,
			},
		],
	},
}

export const HelpText: Story = {
	parameters: {
		docs: {
			description: {
				story: 'La prop `helpText` affiche un texte d\'aide sous le champ. Il disparaît au profit des messages de validation quand ceux-ci sont présents.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<SyTextArea
		v-model="text"
		label="Observations médicales"
		help-text="Décrivez les symptômes observés, leur durée et leur intensité."
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
const text = ref('')
</script>`,
			},
		],
	},
	args: {
		'label': 'Observations médicales',
		'helpText': 'Décrivez les symptômes observés, leur durée et leur intensité.',
		'onUpdate:modelValue': fn(),
	},
}

export const Required: Story = {
	args: {
		'label': 'Texte requis',
		'required': true,
		'onUpdate:modelValue': fn(),
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<SyTextArea
		uniqueId: 'text-area-unique-id',
		v-model="text"
		label="Texte requis"
		:required="true"
	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
const text = ref('')
</script>
				`,
			},
		],
	},
}

export const HideDetails: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Avec `hideDetails: true`, la zone des messages est masquée tant qu\'il n\'y a pas de messages de validation. Utile pour gagner de l\'espace vertical dans les formulaires denses.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<SyTextArea
		v-model="text"
		label="Note interne"
		:hide-details="true"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
const text = ref('')
</script>`,
			},
		],
	},
	args: {
		'label': 'Note interne',
		'hideDetails': true,
		'onUpdate:modelValue': fn(),
	},
	render: () => ({
		components: { SyTextArea },
		setup() {
			const value = ref('')
			return { value }
		},
		template: `
			<SyTextArea
				v-model="value"
				label="Note interne"
				:hide-details="true"
				:show-success-messages="false"
			/>
		`,
	}),
}

export const Clearable: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Avec `clearable: true`, un bouton permet de vider rapidement le contenu du textarea quand une valeur est présente.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<SyTextArea
		v-model="text"
		label="Commentaire"
		clearable
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
const text = ref('Texte initial')
</script>`,
			},
		],
	},
	args: {
		'label': 'Commentaire',
		'clearable': true,
		'onUpdate:modelValue': fn(),
	},
	render: () => ({
		components: { SyTextArea },
		setup() {
			const value = ref('Texte initial')
			return { value }
		},
		template: `
			<SyTextArea
				v-model="value"
				label="Commentaire"
				clearable
			/>
		`,
	}),
}

export const Trim: Story = {
	args: {
		'label': 'Trim text area',
		'trim': true,
		'onUpdate:modelValue': fn(),
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<SyTextArea
		uniqueId: 'text-area-unique-id',
		v-model="text"
		label="Trim text area"
		:trim="true"
	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
const text = ref('')
</script>
				`,
			},
		],
	},
	decorators: [
		story => ({
			components: { story },
			template: `<div>
	<p class="pb-5">Les espaces, tabulations et retours a la lignes de début et fin de champ seront retirés</p>
	<story />
</div>`,
		}),
	],
}

export const ReplaceTabs: Story = {
	args: {
		'label': 'Replace tabs text area',
		'replaceTabs': 4,
		'onUpdate:modelValue': fn(),
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<SyTextArea
	    uniqueId: 'text-area-unique-id',
		v-model="text"
		label="Replace tabs text area"
		:replace-tabs="4"
	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
const text = ref('')
</script>
				`,
			},
		],
	},
	decorators: [
		story => ({
			components: { story },
			template: `<div>
	<p class="pb-5">Les tabulations seront remplacées par 4 espaces</p>
	<story />
</div>`,
		}),
	],
}

export const MaxLines: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<SyTextArea
	    uniqueId: 'text-area-unique-id',
		v-model="text"
		label="Max lines text area"
		:max-lines="5"
	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
const text = ref('')
</script>
				`,
			},
		],
	},
	decorators: [
		story => ({
			components: { story },
			template: `<div>
	<p class="pb-5">Le nombre maximum de lignes est de 5</p>
	<story />
</div>`,
		}),
	],
	render: () => ({
		components: { SyTextArea },
		setup() {
			const value = ref('Lorem ipsum dolor sit amet,\n consectetur adipiscing elit,\n sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n Ut enim ad minim veniam,\n quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\n Excepteur sint occaecat cupidatat non proident,\n sunt in culpa qui officia deserunt mollit anim id est laborum.')
			const textAreaRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)

			onMounted(async () => {
				await nextTick()
				textAreaRef.value?.validateOnSubmit()
			})

			return { value, textAreaRef }
		},
		template: `
			<SyTextArea
				ref="textAreaRef"
				v-model="value"
				label="Max lines text area"
				:max-lines="5"
			/>
		`,
	}),
}

export const AutoWrap: Story = {
	args: {
		'label': 'Auto wrap text area',
		'autoWrap': 50,
		'onUpdate:modelValue': fn(),
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<SyTextArea
	    uniqueId: 'text-area-unique-id',
		v-model="text"
		label="Auto wrap text area"
		:auto-wrap="50"
	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
const text = ref('')
</script>
				`,
			},
		],
	},
	decorators: [
		story => ({
			components: { story },
			template: `<div>
	<p class="pb-5">Le texte sera automatiquement coupé tous les 50 caractères</p>
	<story />
</div>`,
		}),
	],
}

export const Normalize: Story = {
	args: {
		'label': 'Normalize text area',
		'normalize': true,
		'onUpdate:modelValue': fn(),
	},
	parameters: {
		docs: {
			description: {
				story: 'La normalisation NFC (Canonical Decomposition, followed by Canonical Composition) unifie les représentations Unicode d\'un même caractère. Par exemple, le caractère `é` peut être encodé de deux façons : comme un seul point de code (`U+00E9`) ou comme la lettre `e` suivie d\'un accent aigu combinant (`U+0065` + `U+0301`). Avec `normalize: true`, ces deux formes sont automatiquement converties en une seule représentation canonique à la saisie, garantissant la cohérence des données.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<SyTextArea
	    uniqueId: 'text-area-unique-id',
		v-model="text"
		label="Normalize text area"
		:normalize="true"
	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
const text = ref('')
</script>
				`,
			},
		],
	},
	decorators: [
		story => ({
			components: { story },
			template: `<div>
	<p class="pb-5">La normalisation NFC unifie les représentations Unicode d'un même caractère. Par exemple, le caractère <code>é</code> peut être encodé de deux façons : comme un seul point de code (<code>U+00E9</code>) ou comme la lettre <code>e</code> suivie d'un accent aigu combinant (<code>U+0065</code> + <code>U+0301</code>).<br/>Avec <code>normalize: true</code>, ces deux formes sont automatiquement converties en une seule représentation canonique à la saisie, garantissant la cohérence des données.</p>
	<story />
</div>`,
		}),
	],
}
