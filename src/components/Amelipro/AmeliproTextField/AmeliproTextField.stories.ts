import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, watch } from 'vue'
import AmeliproTextField from './AmeliproTextField.vue'

const meta = {
	argTypes: {
		'append': { description: 'Permet d\'ajouter un élément juste après le champ' },
		'required': {
			default: false,
			description: 'Défini que le champ est obligatoire',
			name: 'required',
			type: 'boolean',
		},
		'classes': { description: 'Classes à appliquer à la racine du composant' },
		'clearable': { description: 'Affiche un bouton permettant de vider le champ' },
		'counter': { description: 'Défini la valeur du compteur de caractères' },
		'disabled': { description: 'Désactive le champ de texte' },
		'fullWidthErrorMsg': { description: 'Donne au messages d’erreurs la largeur totale du composant au lieu de la limiter à la largeur du champ' },
		'globalMaxWidth': { description: 'Gère la largeur maximale du composant, attend une valeur et une unité valide css (ex : 400px ou 25%)' },
		'globalMinWidth': { description: 'Gère la largeur minimale du composant, attend une valeur et une unité valide css (ex : 400px ou 25%)' },
		'globalWidth': { description: 'Gère la largeur du composant, attend une valeur et une unité valide css (ex : 400px ou 25%)' },
		'hideErrorMessage': { description: 'Masque ou affiche le message d’erreur, si la valeur est à "auto" le message ne sera rendu que s’il y en a un' },
		'horizontal': { description: 'Passe le champ au format horizontal' },
		'inputMaxWidth': { description: 'Gère la largeur maximale du champ, attend une valeur et une unité valide css (ex : 400px ou 25%)' },
		'inputMinWidth': { description: 'Gère la largeur minimale du champ, attend une valeur et une unité valide css (ex : 400px ou 25%)' },
		'label': { description: 'Défini le label du champ' },
		'labelInfo': { description: 'Permet d\'ajouter des infos à la suite du libellé du champ' },
		'labelMaxWidth': { description: 'Gère la largeur maximale du label, attend une valeur et une unité valide css (ex : 400px ou 25%)' },
		'labelMinWidth': { description: 'Gère la largeur minimale du label, attend une valeur et une unité valide css (ex : 400px ou 25%)' },
		'maxDate': { description: 'Date limite maximale pour le champ (uniquement si type date), format attendu YYYY-MM-DD' },
		'maxNumber': { description: 'Nombre maximal pour le champ (uniquement si type number)' },
		'messagesToDisplay': { description: 'Messages à afficher' },
		'minDate': { description: 'Date limite minimale pour le champ (uniquement si type date), format attendu YYYY-MM-DD' },
		'minNumber': { description: 'Nombre minimal pour le champ (uniquement si type number)' },
		'modelValue': { description: 'Défini la valeur du champ' },
		'placeholder': { description: 'Placeholder du champ' },
		'readonly': { description: 'Passe le champ de texte en lecture seule' },
		'rules': {
			description: 'Liste des règles à respecter pour valider le champ',
			table: { type: 'ValidationRule[]' },
		},
		'type': { description: 'Type du champ' },
		'uniqueId': { description: 'Défini un id pour le champ' },
		'update:model-value': { description: 'Événement émis au changement du v-model' },
		'validateOn': { description: 'Défini le moment où la validation du champ se fait, voir la documentation de Vuetify pour plus d’informtations' },
	},
	component: AmeliproTextField,
	title: 'Composants/Amelipro/Formulaires/AmeliproTextField',
} as Meta<typeof AmeliproTextField>

export default meta

type Story = StoryObj<typeof AmeliproTextField>

export const Default: Story = {
	args: {
		label: 'Mon label',
		modelValue: '',
		uniqueId: 'text-example',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproTextField
		v-model="model"
		label="Label"
		unique-id="text-example"
	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproTextField } from '@cnamts/synapse'
	import { ref } from 'vue'

	const model = ref()
</script>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTextField },
		setup() {
			const model = ref()
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<AmeliproTextField
	v-bind="args"
	v-model="model"
/>`,
	}),
}

export const Date: Story = {
	args: {
		required: true,
		label: 'Mon label',
		maxDate: '2024-02-20',
		minDate: '2024-01-20',
		modelValue: '',
		type: 'date',
		uniqueId: 'date-example',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<p>Exemple de champ texte de type date.</p>
<template>
	<AmeliproTextField
		v-model="model"
		required
		classes="mt-2"
		label="Mon label"
		max-date="2024-02-20"
		min-date="2024-01-20"
		type="date"
		unique-id="date-example"
	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproTextField } from '@cnamts/synapse'
	import { ref } from 'vue'

	const model = ref()
</script>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTextField },
		setup() {
			const model = ref()
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `
<p>Exemple de champ texte de type date.</p>
<AmeliproTextField
	v-bind="args"
	v-model="model"
/>`,
	}),
}

export const Number: Story = {
	args: {
		required: true,
		label: 'Mon label',
		maxNumber: '10',
		minNumber: '0',
		modelValue: '',
		type: 'number',
		uniqueId: 'number-example',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<p>Exemple de champ texte de type number.</p>
<template>
	<AmeliproTextField
		v-model="model"
		required
		classes="mt-2"
		label="Mon label"
		max-number="10"
		min-number="0"
		type="number"
		unique-id="number-example"
	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproTextField } from '@cnamts/synapse'
	import { ref } from 'vue'

	const model = ref()
</script>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTextField },
		setup() {
			const model = ref()
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p>Exemple de champ texte de type number.</p>
<AmeliproTextField
	v-bind="args"
	v-model="model"
/>`,
	}),
}

export const Clearable: Story = {
	args: {
		label: 'Champ effaçable',
		modelValue: 'Texte à effacer',
		uniqueId: 'text-clearable',
		clearable: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p>Le champ peut être effacé grâce à la prop <code>clearable</code>.</p>
	<AmeliproTextField
		v-model="model"
		label="Champ effaçable"
		unique-id="text-clearable"
		clearable
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproTextField } from '@cnamts/synapse'
	import { ref } from 'vue'

	const model = ref('Texte à effacer')
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTextField },
		setup() {
			const model = ref('Texte à effacer')
			watch(() => args.modelValue, (newValue) => {
				model.value = String(newValue)
			})
			return { args, model }
		},
		template: `
<p>Le champ peut être effacé grâce à la prop <code>clearable</code>.</p>
<AmeliproTextField
	v-bind="args"
	v-model="model"
/>
`,
	}),
}

export const Counter: Story = {
	args: {
		label: 'Champ avec compteur',
		modelValue: '',
		uniqueId: 'text-counter',
		counter: 20,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p>Le champ affiche un compteur de caractères grâce à la prop <code>counter</code>.</p>
	<AmeliproTextField
		v-model="model"
		label="Champ avec compteur"
		unique-id="text-counter"
		:counter="20"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproTextField } from '@cnamts/synapse'
	import { ref } from 'vue'

	const model = ref()
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTextField },
		setup() {
			const model = ref()
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `
<p>Le champ affiche un compteur de caractères grâce à la prop <code>counter</code>.</p>
<AmeliproTextField
	v-bind="args"
	v-model="model"
/>
`,
	}),
}

export const CustomWidth: Story = {
	args: {
		label: 'Largeur personnalisée',
		modelValue: '',
		uniqueId: 'text-width',
		globalWidth: '400px',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p>La largeur du champ est personnalisée grâce à la prop <code>globalWidth</code>.</p>
	<AmeliproTextField
		v-model="model"
		label="Largeur personnalisée"
		unique-id="text-width"
		global-width="400px"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproTextField } from '@cnamts/synapse'
	import { ref } from 'vue'

	const model = ref()
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTextField },
		setup() {
			const model = ref()
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `
<p>La largeur du champ est personnalisée grâce à la prop <code>globalWidth</code>.</p>
<AmeliproTextField
	v-bind="args"
	v-model="model"
/>
`,
	}),
}

export const Disabled: Story = {
	args: {
		label: 'Champ désactivé',
		modelValue: '',
		uniqueId: 'text-disabled',
		disabled: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p>Le champ est désactivé grâce à la prop <code>disabled</code>.</p>
	<AmeliproTextField
		v-model="model"
		label="Champ désactivé"
		unique-id="text-disabled"
		disabled
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproTextField } from '@cnamts/synapse'
	import { ref } from 'vue'

	const model = ref()
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTextField },
		setup() {
			const model = ref()
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `
<p>Le champ est désactivé grâce à la prop <code>disabled</code>.</p>
<AmeliproTextField
	v-bind="args"
	v-model="model"
/>`,
	}),
}

export const FullWidthErrorMsg: Story = {
	args: {
		label: 'Message d’erreur pleine largeur',
		modelValue: '',
		uniqueId: 'text-fullwidth-error',
		rules: [v => !!v || 'Affichage d’un long message d’erreur pour la démonstration'],
		fullWidthErrorMsg: true,
		inputMaxWidth: '100px',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p>Le message d’erreur occupe toute la largeur grâce à la prop <code>fullWidthErrorMsg</code>.</p>
	<AmeliproTextField
		v-model="model"
		label="Message d’erreur pleine largeur"
		unique-id="text-fullwidth-error"
		:rules="[v => !!v || 'Affichage d’un long message d’erreur pour la démonstration']"
		:full-width-error-msg="true"
		input-max-width="100px"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproTextField } from '@cnamts/synapse'
	import { ref } from 'vue'

	const model = ref()
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTextField },
		setup() {
			const model = ref()
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `
<p>Le message d’erreur occupe toute la largeur grâce à la prop <code>fullWidthErrorMsg</code>.</p>
<AmeliproTextField
	v-bind="args"
	v-model="model"
/>
`,
	}),
}

export const HideErrorMessage: Story = {
	args: {
		label: 'Masquer le message d’erreur',
		modelValue: '',
		uniqueId: 'text-hide-error',
		rules: [v => !!v || 'Erreur obligatoire'],
		hideErrorMessage: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p>Le message d’erreur est masqué grâce à la prop <code>hideErrorMessage</code>.</p>
	<AmeliproTextField
		v-model="model"
		label="Masquer le message d’erreur"
		unique-id="text-hide-error"
		:rules="[v => !!v || 'Erreur obligatoire']"
		:hide-error-message="true"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproTextField } from '@cnamts/synapse'
	import { ref } from 'vue'

	const model = ref()
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTextField },
		setup() {
			const model = ref()
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `
<p>Le message d’erreur est masqué grâce à la prop <code>hideErrorMessage</code>.</p>
<AmeliproTextField
	v-bind="args"
	v-model="model"
/>
`,
	}),
}

export const Horizontal: Story = {
	args: {
		label: 'Champ horizontal',
		modelValue: '',
		uniqueId: 'text-horizontal',
		horizontal: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p>Le champ est affiché en mode horizontal grâce à la prop <code>horizontal</code>.</p>
	<AmeliproTextField
		v-model="model"
		label="Champ horizontal"
		unique-id="text-horizontal"
		horizontal
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproTextField } from '@cnamts/synapse'
	import { ref } from 'vue'

	const model = ref()
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTextField },
		setup() {
			const model = ref()
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `
<p>Le champ est affiché en mode horizontal grâce à la prop <code>horizontal</code>.</p>
<AmeliproTextField
	v-bind="args"
	v-model="model"
/>
`,
	}),
}

export const LabelMaxWidth: Story = {
	args: {
		label: 'Un très long label dont la largeur est personnalisée',
		modelValue: '',
		uniqueId: 'text-label-maxwidth',
		labelMaxWidth: '200px',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p>La largeur du label est limitée grâce à la prop <code>labelMaxWidth</code>.</p>
	<AmeliproTextField
		v-model="model"
		label="Un très long label dont la largeur est personnalisée"
		unique-id="text-label-maxwidth"
		label-max-width="200px"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproTextField } from '@cnamts/synapse'
	import { ref } from 'vue'

	const model = ref()
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTextField },
		setup() {
			const model = ref()
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `
<p>La largeur du label est limitée grâce à la prop <code>labelMaxWidth</code>.</p>
<AmeliproTextField
	v-bind="args"
	v-model="model"
/>
`,
	}),
}

export const Placeholder: Story = {
	args: {
		label: 'Champ avec placeholder',
		modelValue: '',
		uniqueId: 'text-placeholder',
		placeholder: 'Saisissez votre texte ici...',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p>Le champ affiche un placeholder grâce à la prop <code>placeholder</code>.</p>
	<AmeliproTextField
		v-model="model"
		label="Champ avec placeholder"
		unique-id="text-placeholder"
		placeholder="Saisissez votre texte ici..."
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproTextField } from '@cnamts/synapse'
	import { ref } from 'vue'

	const model = ref()
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTextField },
		setup() {
			const model = ref()
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `
<p>Le champ affiche un placeholder grâce à la prop <code>placeholder</code>.</p>
<AmeliproTextField
	v-bind="args"
	v-model="model"
/>
`,
	}),
}

export const Readonly: Story = {
	args: {
		label: 'Lecture seule',
		modelValue: 'Valeur non modifiable',
		uniqueId: 'text-readonly',
		readonly: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p>Le champ est en lecture seule grâce à la prop <code>readonly</code>.</p>
	<AmeliproTextField
		v-model="model"
		label="Lecture seule"
		unique-id="text-readonly"
		readonly
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproTextField } from '@cnamts/synapse'
	import { ref } from 'vue'

	const model = ref('Valeur non modifiable')
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTextField },
		setup() {
			const model = ref('Valeur non modifiable')
			watch(() => args.modelValue, (newValue) => {
				model.value = String(newValue)
			})
			return { args, model }
		},
		template: `
<p>Le champ est en lecture seule grâce à la prop <code>readonly</code>.</p>
<AmeliproTextField
	v-bind="args"
	v-model="model"
/>
`,
	}),
}

export const Required: Story = {
	args: {
		label: 'Champ requis',
		modelValue: '',
		uniqueId: 'text-required',
		required: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p>Le champ est requis grâce à la prop <code>required</code>.</p>
	<AmeliproTextField
		v-model="model"
		label="Champ requis"
		unique-id="text-required"
		required
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproTextField } from '@cnamts/synapse'
	import { ref } from 'vue'

	const model = ref()
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTextField },
		setup() {
			const model = ref()
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `
          <p>Le champ est requis grâce à la prop <code>required</code>.</p>
<AmeliproTextField
	v-bind="args"
	v-model="model"
/>
`,
	}),
}

export const Validation: Story = {
	args: {
		label: 'Champ avec validation',
		modelValue: '',
		uniqueId: 'text-validation',
		rules: [v => !!v || 'Ce champ est obligatoire'],
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p>Le champ utilise la prop <code>rules</code> pour valider la saisie.</p>
	<AmeliproTextField
		v-model="model"
		label="Champ avec validation"
		unique-id="text-validation"
		:rules="[v => !!v || 'Ce champ est obligatoire']"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproTextField } from '@cnamts/synapse'
	import { ref } from 'vue'

	const model = ref()
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTextField },
		setup() {
			const model = ref()
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `
<p>Le champ utilise la prop <code>rules</code> pour valider la saisie.</p>
<AmeliproTextField
	v-bind="args"
	v-model="model"
/>
`,
	}),
}
