import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import SyRadioGroup from '@/components/Customs/SyRadioGroup/SyRadioGroup.vue'
import SyForm from '../SyForm/SyForm.vue'
import { VBtn } from 'vuetify/components'
import { getValidationDocumentation } from '@/composables/unifyValidation/documentationValidationProps'

const meta: Meta<typeof SyRadioGroup> = {
	title: 'Composants/Formulaires/SyRadioGroup',
	component: SyRadioGroup,
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: `
SyRadioGroup est un composant de groupe de boutons radio.
Il permet de choisir **une seule valeur** parmi une liste d’options.
        `,
			},
		},
	},
	argTypes: {
		...getValidationDocumentation(),
		locales: {
			description: 'Surcharge des chaînes affichées à l\'utilisateur (libellés et messages de validation). Les valeurs par défaut sont définies dans le fichier `locales.ts` du composant.',
			control: 'object',
			table: {
				type: { summary: 'object', detail: `{
	requiredField: (label: string) => string,
	labelledbyMessage: string,
}` },
				category: 'props',
			},
		},
		modelValue: { control: false },
		label: {
			description: 'Label du groupe',
			control: 'text',
		},
		options: {
			description: 'Liste des options du radio-group',
			control: 'object',
		},
		color: {
			control: 'select',
			options: ['primary', 'secondary', 'success', 'error', 'warning'],
			description: 'Couleur du groupe',
		},
		density: {
			control: 'select',
			options: ['default', 'comfortable', 'compact'],
			description: 'Densité du groupe',
		},
		displayAsterisk: {
			description: 'Affiche un astérisque pour les champs requis',
			control: 'boolean',
		},
		helpText: {
			description: 'Texte d\'aide affiché sous le champ',
			control: 'text',
		},
		ariaLabel: {
			description: 'Label ARIA pour les lecteurs d\'écran',
			control: 'text',
		},
		ariaLabelledby: {
			description: 'ID d\'un élément qui labelise le groupe',
			control: 'text',
		},
		title: {
			description: 'Attribut title du groupe',
			control: 'text',
		},
		name: {
			description: 'Nom du groupe (attribut name)',
			control: 'text',
		},
	},
}

export default meta
type Story = StoryObj<typeof SyRadioGroup>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
                  <SyRadioGroup
                    v-model="selected"
                    label="Choisissez une option"
                    :options="options"
                  />
                `,
			},
			{
				name: 'Script',
				code: `
              <script setup lang="ts">
                import { ref } from 'vue'
                import { SyRadioGroup } from '@cnamts/synapse'

                const selected = ref('a')

                const options = [
                    { label: 'Option A', value: 'a' },
                    { label: 'Option B', value: 'b' },
                    { label: 'Option C', value: 'c' },
                ]
              </script>
            `,
			},
		],
	},
	args: {
		label: 'Choisissez une option',
		options: [
			{ label: 'Option A', value: 'a' },
			{ label: 'Option B', value: 'b' },
			{ label: 'Option C', value: 'c' },
		],
	},

	render: args => ({
		components: { SyRadioGroup },
		setup() {
			const selected = ref('a')
			return { args, selected }
		},
		template: `
      <SyRadioGroup v-model="selected" v-bind="args" />
    `,
	}),
}

export const Required: Story = {
	args: {
		label: 'Choisissez une option (obligatoire)',
		required: true,
		options: [
			{ label: 'Option A', value: 'a' },
			{ label: 'Option B', value: 'b' },
		],
	},

	render: args => ({
		components: { SyRadioGroup, SyForm, VBtn },
		setup() {
			const selected = ref(null)
			return { args, selected }
		},
		template: `
		<SyForm ref="form" @submit="onSubmit">
          <SyRadioGroup v-model="selected" required v-bind="args" />
          <v-btn type="submit" class="mt-2 mr-2" color="primary">Valider</v-btn>
          </SyForm>
        `,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
                <SyForm ref="form" @submit="onSubmit">
      			  <SyRadioGroup
      			    v-model="selected"
      			    label="Choisissez une option (obligatoire)"
      			    :options="options"
      			    required
      			  />
      			  <VBtn type="submit" class="mt-2 mr-2" color="primary">Valider</VBtn>
      			</SyForm>`,
			},
			{
				name: 'Script',
				code: `
              <script setup lang="ts">
                import { ref } from 'vue'
                import { VBtn } from 'vuetify/components'
                import { SyForm, SyRadioGroup } from '@cnamts/synapse'

                const selected = ref<string | null>(null)

                const options = [
                    { label: 'Option A', value: 'a' },
                    { label: 'Option B', value: 'b' },
                ]

                const onSubmit = (event: { isValid: boolean }) => {
                    if (event.isValid) {
                        alert('Formulaire valide !')
                    }
                }
             </script>
            `,
			},
		],
	},
}

export const RequiredWithAsterisk: Story = {
	args: {
		label: 'Champ obligatoire',
		required: true,
		displayAsterisk: true,
		options: [
			{ label: 'Option A', value: 'a' },
			{ label: 'Option B', value: 'b' },
		],
	},

	parameters: {
		docs: {
			description: {
				story: `
### Affichage de l'astérisque
Ce story démontre l'affichage d'un astérisque (*) sur le label pour indiquer qu'un champ est obligatoire.
				`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<SyRadioGroup
	v-model="selected"
	label="Champ obligatoire"
	:options="options"
	required
	display-asterisk
/>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SyRadioGroup } from '@cnamts/synapse'

const selected = ref<string | null>(null)

const options = [
	{ label: 'Option A', value: 'a' },
	{ label: 'Option B', value: 'b' },
]
</script>`,
			},
		],
	},

	render: args => ({
		components: { SyRadioGroup },
		setup() {
			const selected = ref<string | null>(null)
			return { args, selected }
		},
		template: `
			<SyRadioGroup
				v-model="selected"
				v-bind="args"
			/>
		`,
	}),
}

export const CustomColors: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
                <div>
                    <SyRadioGroup 
                      v-model="value1" 
                      color="primary" 
                      label="Couleur primaire (par défaut)" 
                      :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]" 
                      :show-success-messages="false"
                    />
                    <SyRadioGroup 
                      v-model="value2" 
                      color="secondary" 
                      label="Couleur secondaire" 
                      :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]"  
                      :show-success-messages="false"
                    />
                    <SyRadioGroup 
                      v-model="value3" 
                      color="onSuccessVariant" 
                      label="Couleur succès" 
                      :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]" 
                      :show-success-messages="false"
                    />
                      <SyRadioGroup 
                        v-model="value4" 
                        color="error" 
                        label="Couleur erreur" 
                        :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]" 
                        :show-success-messages="false"
                    />
                      <SyRadioGroup 
                        v-model="value5" 
                        color="onWarningVariant" 
                        label="Couleur avertissement" 
                        :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]" 
                        :show-success-messages="false"
                    />
                </div>
	`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SyRadioGroup } from '@cnamts/synapse'

const value1 = ref('a')
const value2 = ref('a')
const value3 = ref('a')
const value4 = ref('a')
const value5 = ref('a')
</script>`,
			},
		],
		docs: {
			description: {
				story: `
### Couleurs personnalisées
Le composant SyRadioGroup peut être personnalisé avec différentes couleurs pour s'adapter à votre thème.
				`,
			},
		},
	},
	render: args => ({
		components: { SyRadioGroup },
		setup() {
			const value1 = ref('a')
			const value2 = ref('a')
			const value3 = ref('a')
			const value4 = ref('a')
			const value5 = ref('a')
			return { args, value1, value2, value3, value4, value5 }
		},
		template: `
			<div>
                <SyRadioGroup 
                    v-model="value1"
                    color="primary"
                    label="Couleur primaire (par défaut)" 
                    :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]" 
                    :show-success-messages="false" 
                />
              <SyRadioGroup
                  v-model="value2"
                  color="secondary"
                    label="Couleur secondaire" 
                    :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]"  
                    :show-success-messages="false" 
                />
              <SyRadioGroup
                  v-model="value3"
                  color="onSuccessVariant"
                    label="Couleur succès" 
                    :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]" 
                    :show-success-messages="false" 
                />
              <SyRadioGroup
                  v-model="value4"
                  color="error"
                      label="Couleur erreur" 
                      :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]" 
                      :show-success-messages="false" 
                />
                  <SyRadioGroup
                      v-model="value5"
                      color="onWarningVariant"
                      label="Couleur avertissement" 
                      :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]" 
                      :show-success-messages="false" 
                />
              </div>
		`,
	}),
}

export const DifferentDensities: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
                <div>
                    <SyRadioGroup
                      v-model="val1"
                      density="default"
                      label="Default density"
                      :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]"
                      :show-success-messages="false" 
                    />
                    <SyRadioGroup
                      v-model="val2"
                      density="comfortable"
                      label="Comfortable"
                      :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]"
                      :show-success-messages="false" 
                    />
                    <SyRadioGroup
                      v-model="val3"
                      density="compact"
                      label="Compact"
                      :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]"
                      :show-success-messages="false" 
                    />
                </div>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SyRadioGroup } from '@cnamts/synapse'

const val1 = ref<string | null>(null)
const val2 = ref<string | null>(null)
const val3 = ref<string | null>(null)
</script>`,
			},
		],
		docs: {
			description: {
				story: `
### Différentes densités
Le composant SyRadioGroup prend en charge différentes densités pour s'adapter à différents contextes d'interface utilisateur.
				`,
			},
		},
	},
	render: () => ({
		components: { SyRadioGroup },
		setup() {
			const val1 = ref(null)
			const val2 = ref(null)
			const val3 = ref(null)
			return { val1, val2, val3 }
		},
		template: `
        <div>
        <SyRadioGroup
          v-model="val1"
          density="default"
          label="Default density"
          :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]"
		  :show-success-messages="false" 
        />
        <SyRadioGroup
          v-model="val2"
          density="comfortable"
          label="Comfortable"
          :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]"
		  :show-success-messages="false" 
        />
        <SyRadioGroup
          v-model="val3"
          density="compact"
          label="Compact"
          :options="[{label:'Value 1',value:'a'},{label:'Value 2',value:'b'}]"
		  :show-success-messages="false" 
        />
      </div>
    `,
	}),
}

export const Disabled: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
                <SyRadioGroup
                  v-model="selected"
                  disabled
                  label="Radio-group désactivé"
                  :options="options"
                />
              `,
			},
			{
				name: 'Script',
				code: `
              <script setup lang="ts">
                import { ref } from 'vue'
                import { SyRadioGroup } from '@cnamts/synapse'

                const selected = ref('a')

                const options = [
                    { label: 'Option A', value: 'a' },
                    { label: 'Option B', value: 'b' },
                ]
              </script>
            `,
			},
		],
	},
	args: {
		label: 'Radio-group désactivé',
		disabled: true,
		options: [
			{ label: 'Option A', value: 'a' },
			{ label: 'Option B', value: 'b' },
		],
	},

	render: args => ({
		components: { SyRadioGroup },
		setup() {
			const selected = ref('a')
			return { args, selected }
		},
		template: `
      <SyRadioGroup v-model="selected" v-bind="args" />
    `,
	}),
}

export const EventShowcase: Story = {
	parameters: {
		docs: {
			description: {
				story: `
### Événements
Ce story démontre les événements émis par le composant :
- **update:modelValue** : Émis lorsque la valeur change
- **change** : Émis lorsque la sélection change
				`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<div>
		<SyRadioGroup
			v-model="selected"
			label="Sélectionnez une option"
			:options="options"
			@update:model-value="onUpdate"
			@change="onChange"
		/>
		<div class="mt-4">
			<p>Valeur sélectionnée : {{ selected }}</p>
			<p>Dernier événement : {{ lastEvent }}</p>
		</div>
	</div>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SyRadioGroup } from '@cnamts/synapse'

const selected = ref<string | null>(null)
const lastEvent = ref('')

const options = [
	{ label: 'Option A', value: 'a' },
	{ label: 'Option B', value: 'b' },
	{ label: 'Option C', value: 'c' },
]

const onUpdate = (value: string | null) => {
	lastEvent.value = \`update:modelValue: \${value}\`
	console.log('update:modelValue', value)
}

const onChange = (value: string | null) => {
	lastEvent.value = \`change: \${value}\`
	console.log('change', value)
}
</script>`,
			},
		],
	},

	render: args => ({
		components: { SyRadioGroup },
		setup() {
			const selected = ref<string | null>(null)
			const lastEvent = ref('Aucun événement')

			const options = [
				{ label: 'Option A', value: 'a' },
				{ label: 'Option B', value: 'b' },
				{ label: 'Option C', value: 'c' },
			]

			const onUpdate = (value: string | null) => {
				lastEvent.value = `update:modelValue: ${value}`
			}

			const onChange = (value: string | null) => {
				lastEvent.value = `change: ${value}`
			}

			return { args, selected, options, lastEvent, onUpdate, onChange }
		},
		template: `
			<div>
				<SyRadioGroup
					v-model="selected"
					label="Sélectionnez une option"
					:options="options"
					@update:model-value="onUpdate"
					@change="onChange"
				/>
				<div class="mt-4 pa-4 bg-grey-lighten-4 rounded">
					<p><strong>Valeur sélectionnée :</strong> {{ selected || 'Aucune' }}</p>
					<p><strong>Dernier événement :</strong> {{ lastEvent }}</p>
				</div>
			</div>
		`,
	}),
}

export const Readonly: Story = {
	args: {
		readonly: true,
		options: [
			{ label: 'Option A', value: 'a' },
		],
	},
	render: args => ({
		components: { SyRadioGroup },
		setup() {
			const selected = ref('a')
			return { args, selected }
		},
		template: `<SyRadioGroup v-model="selected" v-bind="args" label="Radio en lecture seule" />`,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<SyRadioGroup 
                  v-model="selected" 
                  label="Radio en lecture seule" 
                  :options="options"
                  readonly
                />`,
			},
			{
				name: 'Script',
				code: `
              <script setup lang="ts">
                import { ref } from 'vue'
                import { SyRadioGroup } from '@cnamts/synapse'

                const selected = ref('a')

                const options = [
                    { label: 'Option A', value: 'a' },
                ]
             </script>
            `,
			},
		],
		docs: {
			description: {
				story: `
### VRadio en lecture seule
Ce button radio est en lecture seule et ne peut pas être modifiée par l'utilisateur, mais elle n'est pas visuellement désactivée comme la version disabled.
				`,
			},
		},
	},

}

export const HideDetails: Story = {
	parameters: {
		docs: {
			description: {
				story: `
### hideDetails
Contrôle l'affichage de la zone de messages sous le champ.

| Valeur | Comportement |
|--------|-------------|
| \`'auto'\` (défaut) | Zone affichée uniquement si un message est présent |
| \`false\` | Zone toujours affichée (espace réservé même sans message) |
| \`true\` | Zone toujours masquée |
				`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<SyForm @submit="onSubmit">
		<p>hide-details="auto" (défaut)</p>
		<SyRadioGroup v-model="selected" label="Option" :options="options" required hide-details="auto" />

		<p>:hide-details="false" (espace toujours réservé)</p>
		<SyRadioGroup v-model="selected" label="Option" :options="options" required :hide-details="false" />

		<p>:hide-details="true" (messages jamais affichés)</p>
		<SyRadioGroup v-model="selected" label="Option" :options="options" required :hide-details="true" />

		<VBtn type="submit" color="primary" class="mt-4">Valider</VBtn>
	</SyForm>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SyRadioGroup, SyForm } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'

const selected = ref<string | null>(null)
const options = [
	{ label: 'Option A', value: 'a' },
	{ label: 'Option B', value: 'b' },
]
const onSubmit = (event: { isValid: boolean }) => {
	if (event.isValid) alert('Formulaire valide !')
}
</script>`,
			},
		],
	},

	render: () => ({
		components: { SyRadioGroup, SyForm, VBtn },
		setup() {
			const selected = ref<string | null>(null)
			const options = [
				{ label: 'Option A', value: 'a' },
				{ label: 'Option B', value: 'b' },
			]
			const onSubmit = (event: { isValid: boolean }) => {
				if (event.isValid) alert('Formulaire valide !')
			}
			return { selected, options, onSubmit }
		},
		template: `
			<SyForm @submit="onSubmit">
				<p class="mb-1 text-body-2">hide-details="auto" (défaut)</p>
				<SyRadioGroup v-model="selected" label="Choisissez une option" :options="options" required hide-details="auto" />

				<p class="mt-4 mb-1 text-body-2">:hide-details="false" (espace toujours réservé)</p>
				<SyRadioGroup v-model="selected" label="Choisissez une option" :options="options" required :hide-details="false" />

				<p class="mt-4 mb-1 text-body-2">:hide-details="true" (messages jamais affichés)</p>
				<SyRadioGroup v-model="selected" label="Choisissez une option" :options="options" required :hide-details="true" />

				<VBtn type="submit" class="mt-6" color="primary">Valider</VBtn>
			</SyForm>
		`,
	}),
}

export const HelpText: Story = {
	parameters: {
		docs: {
			description: {
				story: `
### helpText
Texte d'aide contextuel affiché sous le champ.

**Comportement :**
- Sans message de validation → affiché **à la place du message**
- Avec message (erreur/warning/succès) → affiché **en dessous** du message
				`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<SyForm @submit="onSubmit">
		<p>Sans erreur : helpText affiché à la place du message</p>
		<SyRadioGroup
			v-model="selected"
			label="Choisissez une option"
			:options="options"
			help-text="Sélectionnez l'option qui correspond à votre situation."
		/>

		<p>Avec erreur (required + soumis vide) : helpText affiché en dessous</p>
		<SyRadioGroup
			v-model="selectedWithError"
			label="Choisissez une option"
			:options="options"
			help-text="Sélectionnez l'option qui correspond à votre situation."
			required
		/>

		<VBtn type="submit" color="primary" class="mt-6">Valider</VBtn>
	</SyForm>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SyRadioGroup, SyForm } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'

const selected = ref<string | null>(null)
const selectedWithError = ref<string | null>(null)
const options = [
	{ label: 'Option A', value: 'a' },
	{ label: 'Option B', value: 'b' },
]
const onSubmit = (event: { isValid: boolean }) => {
	if (event.isValid) alert('Formulaire valide !')
}
</script>`,
			},
		],
	},

	render: () => ({
		components: { SyRadioGroup, SyForm, VBtn },
		setup() {
			const selected = ref<string | null>(null)
			const selectedWithError = ref<string | null>(null)
			const options = [
				{ label: 'Option A', value: 'a' },
				{ label: 'Option B', value: 'b' },
			]
			const onSubmit = (event: { isValid: boolean }) => {
				if (event.isValid) alert('Formulaire valide !')
			}
			return { selected, selectedWithError, options, onSubmit }
		},
		template: `
			<SyForm @submit="onSubmit">
				<p class="mb-1 text-body-2">Sans erreur : helpText affiché à la place du message</p>
				<SyRadioGroup
					v-model="selected"
					label="Choisissez une option"
					:options="options"
					help-text="Sélectionnez l'option qui correspond à votre situation."
				/>

				<p class="mt-6 mb-1 text-body-2">Avec erreur (required + soumis vide) : helpText affiché en dessous</p>
				<SyRadioGroup
					v-model="selectedWithError"
					label="Choisissez une option"
					:options="options"
					help-text="Sélectionnez l'option qui correspond à votre situation."
					required
				/>

				<VBtn type="submit" class="mt-6" color="primary">Valider</VBtn>
			</SyForm>
		`,
	}),
}
